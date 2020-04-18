$(function () {
    haeTyypit();
    $('#haeTiedotBtn').click(function () {
        fetch();
    });

    $("#lisaaAsiakas").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            "Tallenna": function () {
                if (true) {
                    if ($("#dNimi").val() != "") {
                        $.post(
                            "http://127.0.0.1:3002/Asiakas",
                            ($("#formLisaaAsiakas").serialize()),
                            function () {
                                $("#lisaaAsiakas").dialog("close");
                                fetch();
                            }
                        );
                    }
                }
            },
            "Poistu": function () {
                $("#lisaaAsiakas").dialog("close");
            }
        }
    });

    $("#lisaaBtn").click(function () {
        $("#dNimi").val("");
        $("#dOsoite").val("");
        $("#dPostinro").val("");
        $("#dPostipaikka").val("");
        $("#tyypit2").val("1");
        $("#lisaaAsiakas").dialog("open");
    });
});

// Asiakastyyppien haku
function haeTyypit() {
    $.get(
        "http://127.0.0.1:3002/Types",
        function (data) {
            // Alasvetovalikkoon haku ilman asiakastyyppiä
             $("#tyypit").append('<option value="-1">Kaikki asiakastyypit</option>');

            // optio lisätä tunnukseton (-1) asiakas asiakkaan lisäys -dialogiin
            // $("#tyypit2").append('<option value="-1">Tunnukseton</option>');

            // Haetaan tietokannasta tyypit alasvetovalikkoon
            $.each(data, function (index, data) {
                $("#tyypit").append('<option value="' + data.Avain + '">' +
                data.Selite + " " + data.Lyhenne + "</option>");
            // ja asiakkaan lisäys -dialogin alasvetovalikkoon
                $("#tyypit2").append('<option value="' + data.Avain + '">' +
                data.Selite + " " + data.Lyhenne + "</option>");
            });
        })
}

// Kaikkien asiakkaiden haku / parametreilla asiakkaiden haku
function fetch() {
    let nimiArvo = $("#nimiHaku").val();
    let osoiteArvo = $("#osoiteHaku").val();
    let astyArvo = $("#tyypit").val();

    let query = "";
    if (nimiArvo != "")
        query += "Nimi=" + nimiArvo + "&";
    if (osoiteArvo != "")
        query += "Osoite=" + osoiteArvo + "&";
    if (astyArvo != "-1")
        query += "asty_avain=" + astyArvo;
    $.get(
        "http://127.0.0.1:3002/Asiakas?" + query,

        function (data, status, xhr) {
            var asiakasData = "";
            $('#table').empty();
            asiakasData += '<tr>';
            asiakasData += '<th>' + 'Avain' + '</th>';
            asiakasData += '<th>' + 'Nimi' + '</th>';
            asiakasData += '<th>' + 'Osoite' + '</th>';
            asiakasData += '<th>' + 'Postinumero' + '</th>';
            asiakasData += '<th>' + 'Postipaikka' + '</th>';
            asiakasData += '<th>' + 'Luontipvm' + '</th>';
            asiakasData += '<th>' + 'As. tyyppi' + '</th>';
            asiakasData += '</tr>';

            $.each(data, function (index, value) {
                asiakasData += '<tr>'
                asiakasData += '<td>' + value.avain + '</td>';
                asiakasData += '<td>' + value.nimi + '</td>';
                asiakasData += '<td>' + value.osoite + '</td>';
                asiakasData += '<td>' + value.postinro + '</td>';
                asiakasData += '<td>' + value.postitmp + '</td>';
                asiakasData += '<td>' + value.luontipvm + '</td>';
                asiakasData += '<td>' + value.asty_avain + '</td>';
               
                    asiakasData += '</tr>'
            });
            $('#table').append(asiakasData);
            
        })
}
