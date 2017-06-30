$(function () {
    var animating;

    function movetostep(stepToIndex) {

        var current_fs = $('fieldset.active'),
            currentIndex = current_fs.data('step'),
            to_fs = $('fieldset.step_' + stepToIndex),
            left,
            opacity,
            scale,
            state = {step: stepToIndex},
            title = 'Step ' + stepToIndex;

        // history.pushState(state,title, 'index.html');
        history.pushState('', '', '?step=' + stepToIndex + '#s');

        if (animating || to_fs.is(current_fs))
            return;

        animating = true;

        //activate next step on progressbar using the index of next_fs

        $("#progressbar li").removeClass("active");
        $("#progressbar li").each(function () {
            if ($(this).data('step') <= stepToIndex) {
                $(this).addClass("active");
            }
        });
        //show the next fieldset
        //hide the current fieldset with style

        if (stepToIndex > currentIndex) {
            current_fs.animate({
                opacity: 0
            }, {
                step: function (now, mx) {
                    //as the opacity of current_fs reduces to 0 - stored in "now"
                    //1. scale current_fs down to 80%
                    scale = 1 - (1 - now) * 0.2;
                    //2. bring next_fs from the right(50%)
                    left = (now * 50) + "%";
                    //3. increase opacity of next_fs to 1 as it moves in
                    opacity = 1 - now;
                    current_fs.css({
                        'transform': 'scale(' + scale + ')',
                        'position': 'absolute'
                    });
                    to_fs.css({
                        'left': left,
                        'opacity': opacity
                    });
                },
                duration: 800,
                complete: function () {
                    current_fs.hide();
                    animating = false;
                },
                //this comes from the custom easing plugin
                easing: 'easeInOutBack'
            });
        } else {
            current_fs.animate({
                opacity: 0
            }, {
                step: function (now, mx) {
                    //as the opacity of current_fs reduces to 0 - stored in "now"
                    //1. scale previous_fs from 80% to 100%
                    scale = 0.8 + (1 - now) * 0.2;
                    //2. take current_fs to the right(50%) - from 0%
                    // left = ((1 - now) * 50) + "%";
                    //3. increase opacity of previous_fs to 1 as it moves in
                    opacity = 1 - now;
                    current_fs.css({
                        'left': left
                    });
                    to_fs.css({
                        'transform': 'scale(' + scale + ')',
                        'opacity': opacity
                    });
                },
                duration: 800,
                complete: function () {
                    current_fs.hide();
                    animating = false;
                },
                //this comes from the custom easing plugin
                easing: 'easeInOutBack'
            });
        }

        $('fieldset').removeClass('active');
        to_fs.show().addClass('active');
    }

    $(".next").click(function () {
        movetostep($(this).parent('fieldset').data('step') + 1);
    });

    $(".previous").click(function () {
        movetostep($(this).parent('fieldset').data('step') - 1);
    });

    $(".submit").click(function () {
        return false;
    });

    $('input[name=summ]').on('blur', function () {
        var summ_selector = $('input[name=summ]'),
            summ_val = document.getElementsByName('summ')[0].value;

        if (+summ_val <= 10000 && +summ_val >= 1) {
            summ_selector.removeClass('incorrect');
            summ_selector.addClass('correct');

            if (summ_selector.hasClass('correct') && $('input[name=time]').hasClass('correct')) {
                $('#step_1_next').prop('disabled', false);
            }
            ;

        } else {
            summ_selector.removeClass('correct');
            summ_selector.addClass('incorrect');
            $('#step_1_next').prop('disabled', true);
        }
    });

    $('input[name=time]').on('blur', function () {
        var time_selector = $('input[name=time]'),
            time_val = document.getElementsByName('time')[0].value;

        if (+time_val <= 12 && +time_val >= 1) {
            time_selector.removeClass('incorrect');
            time_selector.addClass('correct');

            if (time_selector.hasClass('correct') && $('input[name=summ]').hasClass('correct')) {
                $('#step_1_next').prop('disabled', false);
            }

        } else {
            time_selector.removeClass('correct');
            time_selector.addClass('incorrect');
            $('#step_1_next').prop('disabled', true);
        }
    });

    $('input[name=last_name]').on('blur', function () {
        var last_name_val = document.getElementsByName('last_name')[0].value,
            last_name_selector = $('input[name=last_name]'),
            re = /[а-яА-Я]/;


        if (last_name_val !== '' && last_name_val.match(re)) {
            last_name_selector.removeClass('incorrect');
            last_name_selector.addClass('correct');

            if ($('input[type=text]').hasClass('correct')) {
                $('#step_2_next').prop('disabled', false);
            }

        } else {
            last_name_selector.removeClass('correct');
            last_name_selector.addClass('incorrect');
        }
    });

    $('input[name=first_name]').on('blur', function () {
        var first_name_val = document.getElementsByName('first_name')[0].value,
            first_name_selector = $('input[name=first_name]'),
            re = /[а-яА-Я]/;

        if (first_name_val !== '' && first_name_val.match(re)) {
            first_name_selector.removeClass('incorrect');
            first_name_selector.addClass('correct');

            if ($('input[type=text]').hasClass('correct')) {
                $('#step_2_next').prop('disabled', false);
            }

        } else {
            first_name_selector.removeClass('correct');
            first_name_selector.addClass('incorrect');
        }
    });

    $('input[name=inn]').on('blur', function () {
        var inn_val = document.getElementsByName('inn')[0].value,
            inn_start_date = new Date(1900, 0, 1),
            daycount = inn_val.slice(0, 5),
            user_date = new Date(inn_start_date.getTime() + (daycount * 24 * 60 * 60 * 1000));

        if (inn_val.length === 10) {
            if (getAge(user_date) < 21) {
                alert("до 21 года нельзя");
            } else {
                $('input[name=inn]').addClass('correct');

                if ($('input[type=text]').hasClass('correct')) {
                    $('#step_2_next').prop('disabled', false);
                }
            }
        } else {
            alert('Введите ИНН полностью(10 цифр)');
        }
    });

    function getAge(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    $('input[name=city]').on('focus', function () {
        var inputs = $('input[name=city]');
        var options = {
            types: ['(regions)'],
        };
        $(inputs).each(function (i, element) {
            var autocomplete = new google.maps.places.Autocomplete(element, options);

            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                var place = autocomplete.getPlace(); //получаем место
                inputs.addClass('correct');

                if ($('input[type=text]').hasClass('correct')) {
                    $('#step_2_next').prop('disabled', false);
                }
            });
        });

        // This example displays an address form, using the autocomplete feature
        // of the Google Places API to help users fill in the information.

        // This example requires the Places library. Include the libraries=places
        // parameter when you first load the API. For example:
        // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

        var placeSearch, autocomplete;
        var componentForm = {
            street_number: 'short_name',
            route: 'long_name',
            locality: 'long_name',
            administrative_area_level_1: 'short_name',
            country: 'long_name',
            postal_code: 'short_name'
        };

        function initAutocomplete() {
            // Create the autocomplete object, restricting the search to geographical
            // location types.
            autocomplete = new google.maps.places.Autocomplete(
                /** @type {!HTMLInputElement} */($('input[name=city]')),
                {types: ['geocode']});

            // When the user selects an address from the dropdown, populate the address
            // fields in the form.
            autocomplete.addListener('place_changed', fillInAddress);
        }

        function fillInAddress() {
            // Get the place details from the autocomplete object.
            var place = autocomplete.getPlace();

            for (var component in componentForm) {
                document.getElementById(component).value = '';
                document.getElementById(component).disabled = false;
            }

            // Get each component of the address from the place details
            // and fill the corresponding field on the form.
            for (var i = 0; i < place.address_components.length; i++) {
                var addressType = place.address_components[i].types[0];
                if (componentForm[addressType]) {
                    var val = place.address_components[i][componentForm[addressType]];
                    document.getElementById(addressType).value = val;
                }
            }
        }

        // Bias the autocomplete object to the user's geographical location,
        // as supplied by the browser's 'navigator.geolocation' object.
        function geolocate() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var geolocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    var circle = new google.maps.Circle({
                        center: geolocation,
                        radius: position.coords.accuracy
                    });
                    autocomplete.setBounds(circle.getBounds());
                });
            }
        }
    });

    $('#step_2_next').on('click', function () {

        if ($('input[type=text]').length === $('input[type=text].correct').length) {

            $('#data_list li span').each(function (i, elem) {
                var class_name = $(this).attr('class');
                $(this).html($('input[name=' + class_name + ']').val());
            });
        } else {
            alert('Проверьте все поля');
        }

    });

    $('#send').on('click', function () {
        var data = {};

        $('input[type=text]').each(function () {
            data[$(this).attr('name')] = $(this).val();
        });

        $.post('https://google.com',
            data,
            function (data, status) {
                alert("Data: " + data + "\nStatus: " + status);
            });
    });

    $('#progressbar li').on('click', function () {
        var step = $(this).data('step');

        if (step == 3) {
            if ($('input[type=text]').length === $('input[type=text].correct').length) {
                movetostep(step);
            } else {
                alert('Проверьте либо заполните все поля');
            }
        } else if (step == 2) {
            if ($('fieldset.step_1 input[type=text]').length === $('fieldset.step_1 input[type=text].correct').length) {
                movetostep(step);
            } else {
                alert('Проверьте либо заполните все поля');
            }
        } else {
            movetostep(step);
        }
    });

    /*pre-filling START*/
    var user_input_imitation = {
        "summ": "10000",
        "time": "5",
        "inn": "1111111111",
        "last_name": "Иванов",
        "first_name": "Иван",
        "city": "Киев, Kyiv city, Ukraine"
    };

    Object.keys(user_input_imitation).forEach(function (key) {
        $('input[name=' + key + ']').val(user_input_imitation[key]);
    });
    $('#data_list li span').each(function (i, elem) {
        var class_name = $(this).attr('class');
        $(this).html($('input[name=' + class_name + ']').val());
    });
    /*pre-filling END*/

    if (window.location.hash && window.location.hash.indexOf('s') !== -1) {
        var current_step = getParameterByName('step');

        movetostep(current_step);

        function getParameterByName(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }
    }

});