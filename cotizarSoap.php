<?php
    header('Content-Type: application/json');
    $data = json_decode( file_get_contents('php://input') );
    
    $url = "https://ws.intermundial.es/travelio-soaTIO/CommonsWSSessionBean?wsdl";

    $options = array(
        'trace' => 1,
        'location' => 'https://ws.intermundial.es/travelio-soaTIO/CommonsWSSessionBean',
        'cache_wsdl' => WSDL_CACHE_NONE,
        'soap_action' => 'show',
        'soap_version'   => SOAP_1_1,
        "stream_context" => stream_context_create(
            [
                'ssl' => [
                    'verify_peer'      => false,
                    'verify_peer_name' => false,
                ]
            ]
        )
    );

    try {
        
        $client = new SoapClient($url, $options);

        $parametros = [
            "authenticationData" => [
                "user" => "BNEXTMX",
                "password" => "BNE160420",
                "locale" => "es_MX",
                "domain" => "intermundial-soaMexico"
            ],
            "excludedInfo" => "PRODUCT_DESCRIPTION",
            "availabilitySearchParams" => [
                "adultNumber" => 1,
                "cheaperAvailability" => false,
                "childNumber" => 0,
                "confirmedAvailability" => true,
                "type" => "SERVICE",
                "varietyNumber" =>1,
                "productId" => "fe3d4e5a-8fca-47a6",
                "arrivalDate" => $_POST['dayInit'],
                "departureDate" => $_POST['dayEnd']
            ]
        ];


        $resultado = $client->getAvailabilityV2($parametros);
        $retPoint = array('success' => true, 'msg' => $resultado);
        

    } catch (Exception $ex) {
        $retPoint =  array('success' => false, 'msg' => "No se pudo conectar cone el servicio, intentalo más tarde");
        
    }

    echo json_encode($retPoint);



?>