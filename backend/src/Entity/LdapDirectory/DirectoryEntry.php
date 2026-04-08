<?php

namespace App\Entity\LdapDirectory;

use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ApiResource(
 *     collectionOperations={
 *         "get"={
 *             "path"="/directory",
 *             "method"="GET"
 *         }
 *     },
 *     description="Représente une entrée de l'annuaire LDAP",
 *     itemOperations={}
 * )
 */
class DirectoryEntry
{
    private int $id = 0;
    private string $firstname = '';
    private string $lastname = '';
    private string $fullname = '';
    private string $function = '';
    private string $landline = '';
    private string $phone = '';
    private string $username = '';
    private string $email = '';
    private string $mail = '';
    private string $location = '';

    public function getId(): int
    {
        return $this->id;
    }

    public function setId(int $id): self
    {
        $this->id = $id;
        return $this;
    }

    public function getFirstname(): string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;
        return $this;
    }

    public function getLastname(): string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;
        return $this;
    }

    public function getFullname(): string
    {
        return $this->fullname;
    }

    public function setFullname(string $fullname): self
    {
        $this->fullname = $fullname;
        return $this;
    }

    public function getFunction(): string
    {
        return $this->function;
    }

    public function setFunction(string $function): self
    {
        $this->function = $function;
        return $this;
    }

    public function getLandline(): string
    {
        return $this->landline;
    }

    public function setLandline(string $landline): self
    {
        $this->landline = $landline;
        return $this;
    }

    public function getPhone(): string
    {
        return $this->phone;
    }

    public function setPhone(string $phone): self
    {
        $this->phone = $phone;
        return $this;
    }

    public function getUsername(): string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;
        return $this;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;
        return $this;
    }

    public function getMail(): string
    {
        return $this->mail;
    }

    public function setMail(string $mail): self
    {
        $this->mail = $mail;
        return $this;
    }

    public function getLocation(): string
    {
        return $this->location;
    }

    public function setLocation(string $location): self
    {
        $this->location = $location;
        return $this;
    }
}

