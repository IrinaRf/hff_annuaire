<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\MaUs;

/**
 * @ApiResource(
 *     collectionOperations={
 *         "get"={
 *             "path"="/users",
 *             "method"="GET"
 *         }
 *     },
 *     itemOperations={}
 * )
 * @ORM\Entity(repositoryClass=MaUs::class)
 * @ORM\Table(name="`user`",
 * indexes={
 *         @ORM\Index(name="idx_username", columns={"username"}),
 *     }
 * )
 * @ORM\HasLifecycleCallbacks
 */
class User
{
	/**
	 * @ORM\Id
	 * @ORM\GeneratedValue
	 * @ORM\Column(type="integer")
	 */
	private int $id;

	/**
	 * @ORM\Column(type="string", length=255, unique=true)
	 */
	private string $username;

	public function __construct()
	{
		// throw new \Exception('Not implemented');
	}

	public function getId(): int
	{
		return $this->id;
	}

	public function getUsername(): string
	{
		return $this->username;
	}
}