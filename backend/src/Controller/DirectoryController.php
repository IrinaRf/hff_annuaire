<?php

namespace App\Controller;

use App\Service\LdapDirectory\LdapService;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use ApiPlatform\Core\Annotation\ApiResource;

class DirectoryController extends AbstractController
{
    /**
     * @Route("/directory", name="app_directory", methods={"GET"})
     */
    public function index(LdapService $ldapService): JsonResponse
    {
        $results = $ldapService->findUsers('(objectClass=person)');

        return new JsonResponse($results);
    }

    /**
     * @Route("/directory/export.xlsx", name="app_directory_export", methods={"GET"})
     */
    public function export(LdapService $ldapService): Response
    {
        $rows = $ldapService->findUsers('(objectClass=person)');

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Annuaire');

        $headers = [
            'Prénom - Nom',
            'Fonction',
            'Adresse mail',
            'Tél',
            'Flotte',
            'Localisation',
        ];

        $sheet->fromArray($headers, null, 'A1');

        $line = 2;
        foreach ($rows as $row) {
            $sheet->fromArray([
                $row['fullname'] ?? '',
                $row['function'] ?? '',
                $row['email'] ?? '',
                $row['phone'] ?? '',
                $row['fleet'] ?? '',
                $row['location'] ?? '',
            ], null, 'A' . $line);
            $line++;
        }

        foreach (range('A', 'J') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }

        $writer = new Xlsx($spreadsheet);
        ob_start();
        $writer->save('php://output');
        $content = ob_get_clean();

        $response = new Response($content);
        $response->headers->set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        $response->headers->set('Content-Disposition', 'attachment; filename="exportAnnuaire.xlsx"');

        return $response;
    }
}
