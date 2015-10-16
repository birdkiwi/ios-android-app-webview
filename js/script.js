$(document).ready(function() {
    $('.js-validate').each(function(){
        $(this).validate({
            errorPlacement: function(error, element) {},
            highlight: function(element) {
                $(element).addClass('has-error');
                $(element).closest('.custom-select, .form-input-group').addClass('has-error');
                if ($(element).data('error-placeholder')) {
                    $(element).attr('placeholder', $(element).data('error-placeholder'));
                }
            },
            unhighlight: function(element) {
                $(element).removeClass('has-error');
                $(element).closest('.custom-select, .form-input-group').removeClass('has-error');
                if ($(element).data('error-placeholder')) {
                    $(element).attr('placeholder', $(element).data('default-placeholder'));
                }
            }
        });
    });

    $('.js-meetings-create-form').on('submit', function(){
        if (!$(this).valid()) {
            alert('Пожалуйста, заполните все необходимые поля!');
        }
    });

    $('.js-meetings-create-form').on('change', function(){
        if ($(this).find('select[name="date"]').val()) {
            $(this).find('select[name="time"]').attr('required', true);
        } else {
            $(this).find('select[name="time"]').attr('required', false);
        }
    });

    $('.js-meetings-list-search').on('submit', function() {
        var form = $(this);
        var actionUrl = form.attr('action');
        var resultsBlock = $($(this).data('search-results-block'));
        var overlay = $('.main-overlay');

        if ($(this).valid()) {

            overlay.show();
            setTimeout(function(){
                overlay.addClass('active');
            }, 100);
            overlay.spin('large');

            $.ajax({
                type: "POST",
                url: actionUrl,
                data: form.find('select, textarea, input').serialize(),
                success: function(data) {
                    if (!data) {
                        alert(data.message);
                        //console.log(data.message);
                    } else {
                        setTimeout(function(){
                            overlay.removeClass('active');

                            setTimeout(function(){
                                overlay.spin(false);
                                overlay.hide();
                            }, 500);

                            resultsBlock.html(data);
                        }, 500);
                    }
                }
            });
        }

        return false;
    });
});

function addUserTag(userId, userName) {
    var tagArea = $('#meetings-search-tags');

    tagArea.append('<a href="#" data-meetings-search-remove="' + userId + '" class="meetings-list-search-tags-item animated bounceIn">' + userName + '</a>');
}

function removeUserTag(userId) {
    var tagArea = $('#meetings-search-tags');

    tagArea.find('[data-meetings-search-remove=' + userId + ']').remove();
}

$(document).on('click', '[data-meetings-search-add]', function(){
    var userId = $(this).data('meetings-search-add');
    var userName = $(this).data('meetings-search-add-name');
    var checker = $(this).find('.meetings-list-item-check');

    if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        checker.removeClass('active');
        removeUserTag(userId);
    } else {
        $(this).addClass('active');
        checker.addClass('active');
        addUserTag(userId, userName);
    }

    return false;
});

$(document).on('click', '[data-meetings-search-remove]', function(){
    var userId = $(this).data('meetings-search-remove');

    $('[data-meetings-search-add='+ userId + ']').removeClass('active');
    $('[data-meetings-search-add='+ userId + ']').find('.meetings-list-item-check').removeClass('active');

    removeUserTag(userId);
});

$(document).on('click', '.js-input-clear', function() {
    var input = $(this).siblings('input');
    input.val('');
    return false;
});