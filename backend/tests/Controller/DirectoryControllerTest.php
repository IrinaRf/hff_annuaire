<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class DirectoryControllerTest extends WebTestCase
{
    /**
     * Teste que la route API de l'annuaire répond bien et renvoie du JSON.
     */
    public function testDirectoryIndexIsSuccessful(): void
    {
        // 1. On "simule" un navigateur ou l'application React
        $client = static::createClient();

        // 2. On fait une requête GET sur la route de votre API
        $client->request('GET', '/directory');

        // 3. On vérifie que le serveur a bien répondu avec un Code HTTP 20X (ex: 200 OK)
        $this->assertResponseIsSuccessful();

        // 4. On vérifie que la réponse envoyée est bien au format JSON
        $this->assertResponseHeaderSame('Content-Type', 'application/json');
    }

    /**
     * Teste que l'export renvoie bien un fichier de type tableur Excel (.xlsx).
     */
    public function testExportReturnsExcelSheet(): void
    {
        $client = static::createClient();
        $client->request('GET', '/directory/export.xlsx');

        $this->assertResponseIsSuccessful();

        // On vérifie le Content-Type défini dans les headers de votre contrôleur (ligne 70)
        $this->assertResponseHeaderSame(
            'Content-Type', 
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
    }
}
