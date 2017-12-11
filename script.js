$(function () {
    $('.agent-input form').submit(function (e) {
        e.preventDefault();
        send($(this).find('input'));
    });
});

function send(inputElem) {
    var text = inputElem.val();
    inputElem.val('');
    addThread('user', text);
    $.ajax({
        type: "POST",
        url: baseUrl + "query?v=20150910",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + accessToken
        },
        data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),
        success: function(data) {
            speech = data.result.fulfillment.speech
            messages = data.result.fulfillment.messages ? data.result.fulfillment.messages : [];
            message = filterMessage(messages);
            message = message == '' ? speech : message;
            message = message.replace(/(?:\r\n|\r|\n)/g, '<br />');
            addThread('agent', message);
            $('#resultWrapper').stop().animate({
                scrollTop: $('#resultWrapper')[0].scrollHeight
            }, 800);
        },
        error: function() {
            setResponse("Internal Server Error");
        }
    });
}
function filterMessage(msgs)
{
    var message = '';
    for (i in msgs) {
        if(!messages[i].platform) {
            message = msgs[i].speech;
        }
    }
    return message;
}
function addThread(who, text)
{
    var td = $('<div><span>'+ text +'</span></div>');
    if(who == 'agent') {
        $('<p>' + agentName +':</p>').prependTo(td.find('span'));
        td.addClass('server-response');
    }
    else {
        td.addClass('user-request');
    }
    $('#result').append(td);
}