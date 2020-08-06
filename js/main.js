$(function(){
    
    

	$("#wizard").steps({
        headerTag: "h4",
        bodyTag: "section",
        transitionEffect: "fade",
        enableAllSteps: true,
        onStepChanging: function (event, currentIndex, newIndex) { 

            if(currentIndex == 0 && newIndex == 1){
                var dayInit = document.getElementById('dateInit')
                var dayEnd = document.getElementById('dateEnd')
                
                //Validar los dos forms 
                
                if(dayInit.value =='' || dayEnd.value =='' ){
                    console.log('ingresar fecha de inicio y fecha final');
                    $("#errorDate").show();
                    return false;
                }else{
                    $("#errorDate").hide();
                }

                var contentHtml = '';

                var http = new XMLHttpRequest();
                var url = 'cotizarSoap.php';
                var params = 'dayInit='+dayInit.value+'&dayEnd='+dayEnd.value;
                http.open('POST', url, true);
                http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                http.onreadystatechange = function() {//Call a function when the state changes.
                    if(http.readyState == 4 && http.status == 200) {
                        
                        var content = JSON.parse(http.responseText);
                        if(content.msg){ 
                            if(content.msg.availableProducts){
                                //console.log(content.msg.availableProducts.varietyCombinations.modalitiesInfo[0])
                                const listPackage = content.msg.availableProducts.varietyCombinations.varietyDistributions.priceInfo;

                                for(var x=0; x<listPackage.length; x++){
                                  
                                    contentHtml += '<div class="form-row producto"> ';
                                    contentHtml += '<div style="float: left; width: 50%;"> <h4> '+listPackage[x].modality.longName+' </h4> </div>';
                                    contentHtml += '<div style="float: left; width: 30%;"> $'+listPackage[x].price+' '+listPackage[x].currencyCode+'</div>';
                                    contentHtml += '<div style="float: left; width: 20%;"> <input type="radio" name="package" value="'+listPackage[x].modality.code+'" > </div>';
                                    contentHtml += '</div>';                                    
                                }

                                /* Datos agregados */
                                var data  = content.msg.availableProducts.varietyCombinations;
                                // var shortList = content.msg.availableProducts.varietyCombinations;
                                // var detailPack = shortList.varietyDistributions.priceInfo;

                                 document.getElementById('product').value =content.msg.availableProducts.product.code;
                                 document.getElementById('textarea').value=JSON.stringify(content.msg);
                                 
                                
                                /* Datos agregados */
                                
                            }else{
                                contentHtml += '<div class="form-row producto" style="text-align:center"> No se encontró un seguro disponible para esta fecha, pruebe cambiar las fechas </div>';
                            }
                            
                        }else{
                            contentHtml += '<div class="form-row producto" style="text-align:center"> No se encontró un seguro disponible para esta fecha, pruebe cambiar las fechas </div>';
                        }

                        document.getElementById('listaproduct').innerHTML = contentHtml;
                    }
                }
                http.send(params);


            }

            if ( newIndex === 1 ) {

                $('.wizard > .steps ul').addClass('step-2');
            } else {
                var name = document.getElementById('namePoliza');
                var lastname = document.getElementById('lastnamePoliza');
                var address = document.getElementById('direccionPoliza');
                var tel = document.getElementById('telPoliza');
                var email = document.getElementById('emailPoliza');

                if(name.value == '' ){  document.getElementById('errorPersonal').innerHTML = "Debe ingresar su nombre "; $("#errorPersonal").show(); $("html, body").animate({ scrollTop: 0 }, "slow"); return; }
                if(lastname.value == '' ){  document.getElementById('errorPersonal').innerHTML = "Debe ingresar su apellido "; $("#errorPersonal").show();$("html, body").animate({ scrollTop: 0 }, "slow");  return; }
                if(address.value == '' ){  document.getElementById('errorPersonal').innerHTML = "Debe ingresar su dirección "; $("#errorPersonal").show();$("html, body").animate({ scrollTop: 0 }, "slow");  return; }
                if(tel.value == '' ){  document.getElementById('errorPersonal').innerHTML = "Debe ingresar su teléfono "; $("#errorPersonal").show(); $("html, body").animate({ scrollTop: 0 }, "slow"); return; }
                if(email.value == '' ){  document.getElementById('errorPersonal').innerHTML = "Debe ingresar su email "; $("#errorPersonal").show(); $("html, body").animate({ scrollTop: 0 }, "slow"); return; }

                $("#errorPersonal").hide();

                $('.wizard > .steps ul').removeClass('step-2');
            }
            if ( newIndex === 2 ) {
                
                $('.wizard > .steps ul').addClass('step-3');
            } else {
                
                $('.wizard > .steps ul').removeClass('step-3');
            }
            return true; 
        },onFinishing: function(event, currentIndex){
            var package = document.getElementsByName('package')
            var obj = $('#textarea').val()
            var recapturer = JSON.parse(obj);
            
            var isvalid = false;
            var valorRadio;
            for( var x =0; x<package.length; x++){
                
                if(package[x].checked){
                    isvalid = true;
                    valorRadio = package[x].value;
                }
            }

            if(!isvalid){
                document.getElementById('errorPackage').innerHTML = "Debes seleccionar un seguro ";
                $("#errorPackage").show();
                return;
            }else{
                $("#errorPackage").hide();
            }
            
            var seekList =recapturer.availableProducts.varietyCombinations.varietyDistributions.priceInfo;

            var detail = seekList.find(x => x.modality.code == valorRadio);
            
            
            var http = new XMLHttpRequest();
            var url = 'contratarSoap.php';
            var params = 'dayInit='+document.getElementById('dateInit').value;
            params+='&dayEnd='+document.getElementById('dateEnd').value;
            params+='&product='+document.getElementById('product').value;

            params+='&sellContract='+detail.sellContract.code;
            params+='&sellTariff='+detail.sellTariff.code;
            params+='&sellPriceSheet='+detail.sellPriceSheet.code;
            params+='&sellCurrency='+detail.currencyCode;
            params+='&modality='+detail.modality.code;
            params+='&adultNumber=1';
            params+='&name='+document.getElementById('namePoliza').value;
            params+='&surname='+document.getElementById('lastnamePoliza').value;
            params+='&age='+document.getElementById('agePoliza').value;

            console.log('Llego al final', params);

            http.open('POST', url, true);
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            http.onreadystatechange = function() {
                if(http.readyState == 4 && http.status == 200) {
                    console.log(http.responseText)
                }
            }
            http.send(params);

		},
        labels: {
            finish: "Enviar",
            next: "Siguiente",
            previous: "Atrás"
        }
    });
    // Custom Button Jquery Steps
    $('.forward').click(function(){
    	$("#wizard").steps('next');
    })
    $('.backward').click(function(){
        $("#wizard").steps('previous');
    })
    // Date Picker
    var day1 = $('#dateInit').datepicker().data('datepicker');
    //day1.selectDate(new Date());

    var day2 = $('#dateEnd').datepicker().data('datepicker');
    //day2.selectDate(new Date());

})
