<?php

namespace App\Service\LdapDirectory;

use Symfony\Component\Ldap\Ldap;
use Symfony\Component\Security\Core\Exception\AuthenticationException;


class LdapService
{

    private Ldap $ldap;
    private bool $bound = false;

    private string $domain;
    private string $baseDn;
    private string $username;
    private string $password;

    public function __construct(
        Ldap $ldap,
        string $domain,
        string $baseDn,
        string $username,
        string $password
    ) {
        $this->ldap = $ldap;
        $this->domain = $domain;
        $this->baseDn = $baseDn;
        $this->username = $username;
        $this->password = $password;
    }

    private function connect(): void
    {
        if ($this->bound) {
            return;
        }

        $identities = $this->buildBindIdentities($this->username);
        $lastError = null;

        foreach ($identities as $identity) {
            try {
                $this->ldap->bind($identity, $this->password);
                $this->bound = true;

                return;
            } catch (\Exception $e) {
                $lastError = $e;
            }
        }

        throw new AuthenticationException(
            'Impossible de se connecter au serveur LDAP. Identités testées: ' . implode(', ', $identities)
            . '. Dernière erreur: ' . ($lastError ? $lastError->getMessage() : 'Erreur inconnue')
        );
    }

    /**
     * Construit plusieurs formats d'identité LDAP/AD à partir du nom d'utilisateur configuré.
     */
    private function buildBindIdentities(string $username): array
    {
        $username = trim($username);
        $domain = trim($this->domain);

        if ($username === '') {
            return [''];
        }

        if (str_contains($username, '=') || str_contains($username, '@') || str_contains($username, '\\')) {
            return [$username];
        }

        $domainNoAt = ltrim($domain, '@');
        $domainNetbios = strtoupper((string) strtok($domainNoAt, '.'));

        return array_values(array_unique(array_filter([
            $username,
            $domainNoAt !== '' ? $username . '@' . $domainNoAt : null,
            $domainNetbios !== '' ? $domainNetbios . '\\' . $username : null,
            'cn=' . $username . ',' . $this->baseDn,
        ])));
    }

    public function authenticate(string $userName, string $userPassword): bool
    {
        $identities = $this->buildBindIdentities($userName);

        foreach ($identities as $identity) {
            try {
                $this->ldap->bind($identity, $userPassword);

                return true;
            } catch (\Exception $e) {
                // Try the next identity format.
            }
        }

        return false;
    }

    public function search(string $filter = '(objectClass=*)'): array
    {
        $this->connect();

        $query = $this->ldap->query($this->baseDn, $filter);
        $results = $query->execute()->toArray();
        $data = [];
        foreach ($results as $entry) {
            $attributes = $entry->getAttributes();
            $fullname = $attributes['name'][0] ?? '';
            $fullnameLower = strtolower($fullname);
            if (strpos($fullnameLower, '(irium)') !== false || strpos($fullnameLower, 'test') !== false) {
                continue; // Ignorer cette entrée
            }
            if (isset($attributes["givenName"][0])) {
                $rawLoc = $entry->getDn();
                $location = $this->findUserLocation($rawLoc);
                $info = [
                    "firstname"             => $attributes["sn"][0] ?? '',
                    "lastname"              => $attributes["givenName"][0] ?? '',
                    "fullname"              => $fullname,
                    "function"              => $attributes["description"][0] ?? '',
                    "landline"              => $attributes["physicalDeliveryOfficeName"][0] ?? '',
                    "phone"                 => $attributes["telephoneNumber"][0] ?? '',
                    "username"              => $attributes["sAMAccountName"][0],
                    "email"                 => $attributes["mail"][0] ?? '',
                    "mail"                  => $attributes["userPrincipalName"][0],
                    "location"              => $location,
                ];
                $data = [$info, ...$data];
            }
            $rawLoc = $entry->getDn();
        }
        return $data;
    }

    public function findUsers(string $filter = '(objectClass=person)'): array
    {
        return $this->search($filter);
    }

    /**
     * Parse la localisation d'un utilisateur a partir du `dn` de son entrée LDAP
     *
     * @param string $dn
     * @return string
     */
    private function findUserLocation(string $dn): string
    {
        $locParts = explode(',', $dn);

        //? Ne garder que les parties qui commencent par "OU="
        $ouParts = array_filter($locParts, function ($part) {
            return strpos($part, 'OU=') === 0;
        });

        //? Enlever le préfixe "OU=" de chaque partie
        $ouParts = array_map(function ($part) {
            return substr($part, 3);
        }, $ouParts);
        $ouParts = array_values($ouParts);

        $locationStr = "";
        for ($i = count($ouParts) - 1; $i >= 0; --$i) {
            if (strpos($ouParts[$i], 'Users') !== false) {
                continue;
            }
            $locationStr .= $ouParts[$i];
            if ($i > 0) {
                $locationStr .= ' - ';
            }
        }

        return $locationStr;
    }
}
