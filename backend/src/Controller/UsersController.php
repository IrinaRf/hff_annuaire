<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class UsersController extends AbstractController
{

	private EntityManagerInterface $entityManager;

	public function __construct(EntityManagerInterface $entityManager)
	{
		$this->entityManager = $entityManager;
	}

	/**
	 * @Route("/api/users", name="api_users_list", methods={"GET"})
	 */
	public function list(): JsonResponse
	{
		$users = $this->entityManager->getRepository(User::class)->findAll();
		$data = array_map(function (User $user) {
			return [
				'id' => $user->getId(),
				'username' => $user->getUsername(),
			];
		}, $users);

		return $this->json($data);
	}
}