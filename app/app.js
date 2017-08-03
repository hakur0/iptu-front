'use strict';

angular.module('le-iptu', ['rzModule', 'ui.utils.masks']);

angular.module('le-iptu').controller('MainController', ['anchorSmoothScroll', '$http', function(anchorSmoothScroll, $http){
    var _this = this;
    
    this.data = {
        form: {
            iptu_price: 500,
            optin: true
        },
        sliderOptions: {
            floor: 500,
            ceil: 5000,
            step: 500,
            hideLimitLabels: true,
            translate: function(value) {
                if(value === 5000) return 'R$ 5000 ou mais';
                else if(value === 500) return 'R$ 500 ou menos';
                return 'R$ ' + value;
            }
        },
        loadingForm: false,
        formSuccess: false,
        formError: false
    };
    
    
    this.getNeighbourhood = function(){
        if(_this.data.form.cep){
            $http.get('https://viacep.com.br/ws/' + _this.data.form.cep + '/json/').then(function(response){
                _this.data.form.address = response.data;
            });
        }
    };
    
    this.anchor = function(id){
        anchorSmoothScroll.scrollTo(id)
    };
    
    this.sendData = function(){
        var data = angular.copy(_this.data.form);
        
        if(data.address && data.address.localidade === 'Recife') data.neighbourhood = data.address.bairro;
        
        _this.data.loadingForm = true;
        _this.data.formError = false;
        $http.post('http://iptu-development.us-east-1.elasticbeanstalk.com/client/', data).then(function(response){
            _this.data.formSuccess = true;
        }).catch(function(){
            _this.data.formError = true;
            _this.data.loadingForm = false;
        });
    }
}]);

angular.module('le-iptu').service('anchorSmoothScroll', function(){
    this.scrollTo = function(eID){
        // This scrolling function
        // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript
        
        var startY = currentYPosition();
        var stopY = elmYPosition(eID);
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if(distance < 100){
            scrollTo(0, stopY);
            return;
        }
        var speed = Math.round(distance / 100);
        if(speed >= 20) speed = 20;
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if(stopY > startY){
            for(var i = startY; i < stopY; i += step){
                setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
                leapY += step;
                if(leapY > stopY) leapY = stopY;
                timer++;
            }
            return;
        }
        for(var i = startY; i > stopY; i -= step){
            setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
            leapY -= step;
            if(leapY < stopY) leapY = stopY;
            timer++;
        }
        
        function currentYPosition(){
            // Firefox, Chrome, Opera, Safari
            if(self.pageYOffset) return self.pageYOffset;
            // Internet Explorer 6 - standards mode
            if(document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            // Internet Explorer 6, 7 and 8
            if(document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }
        
        function elmYPosition(eID){
            var elm = document.getElementById(eID);
            var y = elm.offsetTop;
            var node = elm;
            while(node.offsetParent && node.offsetParent != document.body){
                node = node.offsetParent;
                y += node.offsetTop;
            }
            return y;
        }
        
    };
});
