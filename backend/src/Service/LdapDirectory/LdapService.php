<?php

namespace App\Service\LdapDirectory;

use Symfony\Component\Security\Core\Exception\AuthenticationException;


class LdapService
{

    private $ldapconn;

    private string $host;
    private int $port;

    private string $domain;
    private string $baseDn;
    private string $username;
    private string $password;

    public function __construct()
    {

        $this->initEnv();
        $this->connect();
    }

    private function initEnv()
    {
        $this->host = $_ENV['LDAP_HOST'] ?? 'localhost';
        $this->port = $_ENV['LDAP_PORT'] ?? '389';

        $this->domain = $_ENV['LDAP_DOMAIN'] ?? '@fraise.hff.mg';
        $this->baseDn = $_ENV['LDAP_BASE_DN'] ?? 'DC=fraise,DC=hff,DC=mg';
        $this->username = $_ENV['LDAP_USER'] ?? '';
        $this->password = $_ENV['LDAP_PASSWORD'] ?? '';
    }

    private function connect(): void
    {
        $this->ldapconn = ldap_connect($this->host, $this->port);
        ldap_set_option($this->ldapconn, LDAP_OPT_PROTOCOL_VERSION, 3);
        ldap_set_option($this->ldapconn, LDAP_OPT_REFERRALS, 0);

        if (!$this->ldapconn) {
            throw new AuthenticationException('Failed to connect to LDAP server.');
        }

        $bind = ldap_bind($this->ldapconn, $this->username . $this->domain, $this->password);
        if (!$bind) {
            throw new AuthenticationException('Failed to bind to LDAP server with provided credentials.');
        }
    }

    public function authenticate(string $username, string $password): bool
    {
        $this->connect();

        $results = $this->search($this->baseDn, sprintf('(sAMAccountName=%s)', $username));

        if (count($results) === 0) {
            throw new AuthenticationException('Utilisateur LDAP non trouvé.');
        }

        $dn = $results[0]->getDn();

        // 3. Bind avec le DN de l'utilisateur et son mot de passe
        try {
            $bind = ldap_bind($this->ldapconn, $dn, $password);
            if (!$bind) {
                throw new AuthenticationException('Échec de l\'authentification LDAP pour l\'utilisateur.');
            }
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function search(string $baseDn, string $filter = '(objectClass=*)')
    {
        $search_res = ldap_search($this->ldapconn, $baseDn, $filter);
        if (!$search_res) {
            return [];
        }

        $entries = ldap_get_entries($this->ldapconn, $search_res);
        if ($entries['count'] === 0) {
            return [];
        }

        $data = [];

        for ($i = 0; $i < $entries['count']; $i++) {
            $entry = $entries[$i];

            // Vérifier si le fullname contient "(IRIUM)" ou "test" (insensible à la casse)
            $fullname = $entries[$i]["name"][0] ?? '';
            $fullnameLower = strtolower($fullname);

            if (strpos($fullnameLower, '(irium)') !== false || strpos($fullnameLower, 'test') !== false) {
                continue; // Ignorer cette entrée
            }

            if (isset($entry["givenname"][0])) {

                $rawLoc = $entries[$i]["dn"];
                $location = $this->findUserLocation($rawLoc);

                $info = [
                    "firstname"             => $entries[$i]["sn"][0] ?? '',
                    "lastname"              => $entries[$i]["givenname"][0] ?? '',
                    "fullname"              => $fullname,
                    "function"              => $entries[$i]["description"][0] ?? '',
                    "landline"              => $entries[$i]["physicaldeliveryofficename"][0] ?? '',
                    "phone"                 => $entries[$i]["telephonenumber"][0] ?? '',
                    "username"              => $entries[$i]["samaccountname"][0],
                    "email"                 => $entries[$i]["mail"][0] ?? '',
                    "mail"                  => $entries[$i]["userprincipalname"][0],
                    "location"              => $location,
                ];
                $data = [$info, ...$data];
            }
        }

        return $data;
    }

    public function findUsers(string $filter = '(objectClass=person)'): array
    {
        return $this->search($this->baseDn, $filter);
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
