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
                    "bookingParams" => [
                        "bookingLines" => [
                            "futureBookingState" => "IN_AGREEMENT",
                            "product" => $_POST['product'],
                            "arrivalDate" => $_POST['dayInit'],
                            "departureDate" => $_POST['dayEnd'],
                            "sellContract" => $_POST['sellContract'],
                            "sellTariff" => $_POST['sellTariff'],
                            "sellPriceSheet" => $_POST['sellPriceSheet'],
                            "sellCurrency" => $_POST['sellCurrency'],
                            "productVariety" => "default",
                            "modality" => $_POST['modality'],
                            "adultNumber" => $_POST['adultNumber'],
                            "passengers" => [
                                            "name" => $_POST['name'], 
                                            "surname" => $_POST['surname'], 
                                            "age" => $_POST['age']
                                            ]
                        ],
                        "holder" => [
                            "type" => "NATURAL",
                            "pid" => "336412492X",
                            "name" => "ADRIAN",
                            "surname" => "CORTES",
                            "locale" => "es_ES",
                        ],
                        "onTheFly" => false,
                        "thirdReference" => "34661RT",            
                    ]
                ];
        // print_r($parametros);
        // die();

        // $retPoint = array('success' => true, 'msg' => $parametros);
        // echo json_encode($retPoint);
        // die();
        $resultado = $client->bookV2($parametros);
        $retPoint = array('success' => true, 'msg' => $resultado);
        

    } catch (Exception $ex) {
        $retPoint =  array('success' => false, 'msg' => "No se pudo conectar con el servicio, intentalo más tarde".$ex->getMessage());
        
    }

    echo json_encode($retPoint);



?>