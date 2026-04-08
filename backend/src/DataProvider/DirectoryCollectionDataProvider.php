<?php

namespace App\DataProvider;

use App\Entity\LdapDirectory\DirectoryEntry;
use App\Service\LdapDirectory\LdapService;
use ApiPlatform\Core\DataProvider\CollectionDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use Symfony\Component\HttpFoundation\RequestStack;

final class DirectoryCollectionDataProvider implements CollectionDataProviderInterface, RestrictedDataProviderInterface
{
    private LdapService $ldapService;
    private RequestStack $requestStack;

    public function __construct(
        LdapService $ldapService,
        RequestStack $requestStack
    ) {
        $this->ldapService = $ldapService;
        $this->requestStack = $requestStack;
    }

    public function supports(string $resourceClass, ?string $operationName = null, array $context = []): bool
    {
        return DirectoryEntry::class === $resourceClass;
    }

    public function getCollection(string $resourceClass, ?string $operationName = null): iterable
    {
        $entries = [];
        $ldapResults = $this->ldapService->findUsers('(objectClass=person)');

        $id = 1;
        foreach ($ldapResults as $result) {
            $entry = new DirectoryEntry();
            $entry->setId($id++);
            $entry->setFirstname($result['firstname'] ?? '');
            $entry->setLastname($result['lastname'] ?? '');
            $entry->setFullname($result['fullname'] ?? '');
            $entry->setFunction($result['function'] ?? '');
            $entry->setLandline($result['landline'] ?? '');
            $entry->setPhone($result['phone'] ?? '');
            $entry->setUsername($result['username'] ?? '');
            $entry->setEmail($result['email'] ?? '');
            $entry->setMail($result['mail'] ?? '');
            $entry->setLocation($result['location'] ?? '');
            
            $entries[] = $entry;
        }

        return $entries;
    }
}
