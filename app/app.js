'use strict';

angular.module('le-iptu', ['rzModule', 'ui.utils.masks']);

angular.module('le-iptu').controller('MainController', ['anchorSmoothScroll', '$http', function(anchorSmoothScroll, $http){
    var _this = this;
    
    this.data = {
        form: {
            iptu_price: 800
        },
        sliderOptions: {
            floor: 100,
            ceil: 3000,
            step: 100,
            hideLimitLabels: true,
            translate: function(value) {
                return 'R$ ' + value + (value === 3000 ? ' ou mais' : '');
            },
            onChange: function(){
                _this.calculateRefundValue()
            }
        }
    };
    
    
    this.getNeighbourhood = function(){
        _this.data.refundValue = null;
        if(_this.data.form.cep){
            $http.get('https://viacep.com.br/ws/' + _this.data.form.cep + '/json/').then(function(response){
                _this.data.form.address = response.data;
                _this.calculateRefundValue();
            });
        }
    };
    
    this.calculateRefundValue = function(){
        if(_this.data.form.cep){
            var len = _this.data.form.address.localidade === 'Recife' ? _this.data.form.address.bairro.length : 7;
            
            _this.data.refundValue =
                (_this.data.form.iptu_price * 1.4) +
                (len * 400);
        }
    };
    
    this.anchor = function(id){
        anchorSmoothScroll.scrollTo(id)
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
