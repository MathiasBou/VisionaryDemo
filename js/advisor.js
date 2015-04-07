function initAdvisor() {
    setupAdvisor();
    updateCustomerData();
}

function setupAdvisor() {
    $("#email-confirmation" ).dialog({
        autoOpen: false,
        resizable: false,
        height:200,
        modal: true,
        buttons: {
            OK: function() {
                //sendOUTSMS($('#mobile').val(), msg);
                $( this ).dialog( "close" );
            },
            Cancel: function() {
                $( this ).dialog( "close" );
            }
        }
    });
    
    $("#accept-confirmation" ).dialog({
        autoOpen: false,resizable: false,height:200,modal: true,
        buttons: {
            OK: function() {
                $( this ).dialog( "close" );
            },
            Cancel: function() {
                $( this ).dialog( "close" );
            }
        }
    });


    $(".ui-layout-north").tabs();
    $(".ui-layout-center").tabs();

    $("#data-title").text("Customer Info");
    $("#analytics-title").text(demoScenario.customerAnalytics.title);
    $("#result-title").text("Customer Recommendations");
    $("#result-action-tab-label").text(demoScenario.nba.title);
    $("#result-history-tab-label").text(demoScenario.nbaHistory.title);
    $("#result-search-tab-label").text(demoScenario.searchHistory.title);
}

function showOfferDetails(offerDetailImg) {
    $("#offerDetailsFrame").css('background-image', "url(" + offerDetailImg + ")");
}


function arrangeAppointment(event){
    $("#email-confirmation").dialog("open");
}


function updateCustomerData() {
    for (var property in demoScenario.formFields) {
        if (demoScenario.formFields.hasOwnProperty(property)) {
            if (property)
                $('#' + property).val(demoScenario.formFields[property]);
        }
    }

    $('.profile_image').attr("src" , demoScenario.formFields['profileImage']);

    for (i = 0; i < demoScenario.customerAnalytics.items.length; i++){
        setProgress('score' + (i + 1), demoScenario.customerAnalytics.items[i].label, demoScenario.customerAnalytics.items[i].value, demoScenario.customerAnalytics.items[i].text);
    }

    refreshAdvisorTables();
}


function setProgress(name, label, percentage, text) {
    var pb = $('#' + name);
    var pbLabel = $('#' + name + '-label');
    var pbText = $('#' + name + '-text');

    if (!pb || !pbLabel || !pbText)
        return;

    if (percentage > demoScenario.customerAnalytics.goodThreshold) {
        if (!pb.hasClass("ui-progress-good")) pb.addClass("ui-progress-good");
        if (pb.hasClass("ui-progress-ok")) pb.removeClass("ui-progress-ok");
        if (pb.hasClass("ui-progress-bad")) pb.removeClass("ui-progress-bad");
    }
    else if (percentage > demoScenario.customerAnalytics.okThreshold) {
        if (pb.hasClass("ui-progress-good")) pb.removeClass("ui-progress-good");
        if (!pb.hasClass("ui-progress-ok")) pb.addClass("ui-progress-ok");
        if (pb.hasClass("ui-progress-bad")) pb.removeClass("ui-progress-bad");
    }
    else {
        if (pb.hasClass("ui-progress-good")) pb.removeClass("ui-progress-good");
        if (pb.hasClass("ui-progress-ok")) pb.removeClass("ui-progress-ok");
        if (!pb.hasClass("ui-progress-bad")) pb.addClass("ui-progress-bad");
    }

    pbLabel.html(label + ':');
    pb.css("width", String(percentage * 100) + '%');
    pbText.html(text);
    pbText.css("padding-right", Math.round(($(".ui-progress-bar").width() * percentage - 30) / 2));
}

function refreshAdvisorTables() {
    refreshNbaHistoryTable();
    refreshNbaTable();
    refreshSearchHistoryTable();
}

function refreshNbaHistoryTable(){
    var htmlOutput = "";
    if(demoScenario.nbaHistory.items) {
        for(var i = 0; i < demoScenario.nbaHistory.items.length; i++) {
            htmlOutput += "<tr><td>"+demoScenario.nbaHistory.items[i]["desc"]+"</td><td>"+demoScenario.nbaHistory.items[i]["responseDate"]+"</td><td>"+demoScenario.nbaHistory.items[i]["response"]+"</td></tr>";
        }
    } else {
        htmlOutput = "<tr><td colspan=\"3\"> No previous NBAs presented to customer </td></tr>";
    }
    $("#advisor-nba-history-tab").html(htmlOutput);
}

function refreshNbaTable() {
    var htmlOutput = "";
    if(demoScenario.nba.items) {
        for(var i = 0; i < demoScenario.nba.items.length; i++) {
            htmlOutput += "<tr><td><b><a onClick=\"showOfferDetails('" +demoScenario.nba.items[i]["detailImg"]+ "');\"><u>" + demoScenario.nba.items[i]["desc"] + "</u></a></b></td><td>"+demoScenario.nba.items[i]["propensity"]+"</td><td>"+ generateNbaResponseButtons(demoScenario.nba.items[i]["id"]) +"</td></tr>";
        }
    } else {
        htmlOutput = "<tr><td colspan=\"3\"> No NBAs presented to customer </td></tr>";
    }
    $("#advisor-nba-tab").html(htmlOutput);
}

function refreshSearchHistoryTable() {
    var htmlOutput = "";
    if(demoScenario.searchHistory.items) {
        for(var i = 0; i < demoScenario.searchHistory.items.length; i++) {
            htmlOutput += "<tr><td>"+demoScenario.searchHistory.items[i]["desc"]+"</td><td>"+demoScenario.searchHistory.items[i]["responseDate"]+"</td><td>"+ demoScenario.searchHistory.items[i]["source"] +"</td></tr>";
        }
    } else {
        htmlOutput = "<tr><td colspan=\"3\"> No Search history data </td></tr>";
    }
    $("#advisor-search-history-tab").html(htmlOutput);
}

function processNbaResponseClick(offerId, responseType) {
    updateNba(offerId, responseType);
}

function generateNbaResponseButtons(offerId) {
    var responseHtml = "";
    responseHtml +="<a href=\"#\" onClick=\"processNbaResponseClick('"+offerId+"', 'acceptOffer');\"><img src='images/checked-disabled.gif'/></a>";
    responseHtml +="<a href=\"#\" onClick=\"processNbaResponseClick('"+offerId+"', 'declineOffer');\"><img src='images/cross-disabled.gif'/></a>";
    responseHtml +="<a href=\"#\" onClick=\"processNbaResponseClick('"+offerId+"', 'maybeOffer');\"><img src='images/history-disabled.png'/></a>";
    return responseHtml;
}


function updateNba(offerId, nbaResponse) {
    $.ajax(dataProviderUrl, {
        type:'GET',
        data:{ action:nbaResponse,  offerId:offerId },
        success:function (jsonData) {
            demoScenario = jsonData;
            console.log("Loading Data from Provider completed.\n" + JSON.stringify(demoScenario));
            updateCustomerData();
        }
    });
}

function resetAdvisorDemo() {
    updateNba("", "restartScenario");
}