//A sample main js file. Use this as a starting point for your app.
const app = new cot_app("Human Rights");
const configURL = "//www1.toronto.ca/static_files/WebApps/CommonComponents/Human_Rights/JSONFeed.js";
let form, config, httpHost;
//let upload_selector = 'admin_dropzone';
const form_id = "hrc";
let myDropzone;
let repo = "human_rights";

$(document).ready(function () {
  app.render(function () {
    initialize();
  });

  function renderApp() {
    httpHost = detectHost();
    loadForm();
    app.setBreadcrumb(app.data['breadcrumbtrail']);
    app.addForm(form, 'top');
    //   myDropzone = new Dropzone("div#admin_dropzone", 
    //   setupDropzone({ fid: '', form_id: form_id, url: config.api_public.upload + config.default_repo + '/' + repo })
    //   );

    initForm();

    myDropzone = new Dropzone("div#admin_dropzone", $.extend(config.admin.myDropzonePublic, {
      "dz_id": "admin_dropzone", "fid": '', "form_id": form_id,
      "url": config.api_public.upload + config.default_repo + '/' + repo,
    }));

    $(".dz-hidden-input").attr("aria-hidden", "true");
    $(".dz-hidden-input").attr("aria-label", "File Upload Control");

  }
  function initialize() {
    loadVariables();
  }
  function loadForm() {
    form = new CotForm({
      id: form_id,
      title: 'Online Complaint Form',
      useBinding: false,
      sections: getSubmissionSections(),
      success: function (e) {
      }
    });
  }
  function loadVariables() {
    $.ajax({
      url: configURL,
      type: "GET",
      cache: "true",
      dataType: "jsonp",
      jsonpCallback: "callback",
      success: function (data) {
        $.each(data.items, function (i, item) { app.data[item.title] = item.summary; });
        config = app.data.config;
        renderApp();
      },
      error: function () {
        alert("Error: The application was unable to load data.")
      }
    })
  }
  function detectHost() {
    switch (window.location.origin) {
      case config.httpHost.root_public.dev:
        return 'dev';
      case config.httpHost.root_public.qa:
        return 'qa';
      case config.httpHost.root_public.prod:
        return 'prod';
      default:
        //   console.log("Cannot find the server parameter in detectHost function. Please check with your administrator.");
        return 'dev';
    }
  }
});
function getFormJSON(form_id) {
  return $("#" + form_id).serializeJSON({ useIntKeysAsArrayIndex: true });
}
function initForm() {
  $("#typeComplaint").on('change', function () {
    getGroundFields(this.value);
  });
  $('[name=cityEmployee]').on('change', function () {
    employeeToggle(this.value);
  });
  $('#cotEmployeeType').on('change', function () {
    unionToggle(this.value);
  });
  $("#divisionComplaint").on('change', function () {
    divisionComplaintToggle(this.value);
  });
  $("#resolveCompQ").on('change', function () {
    solutionToggle();
  })
  $("#hrtoQ").on('change', function () {
    solutionToggle();
  })
  $("#grievanceQ").on('change', function () {
    solutionToggle();
  })

  var dataCreated = new Date();
  $("#complaintCreated").val(dataCreated);
  $("#yearCreated").val(dataCreated.getFullYear());
  $("#complaintStatus").val("New");

  $("#closebtn").click(function () { window.close(); });
  $("#printbtn").click(function () { window.print(); });
  $("#savebtn").click(function () {

    let hrc_fv = $('#hrc').data('formValidation');
    hrc_fv.validate();
    if (hrc_fv.isValid()) { submitForm() }
  });
  getGroundFields("");
  divisionComplaintToggle("");
  employeeToggle("");
  unionToggle('');
  $("#cdText5Element").hide();
  $("#moreDetailsElement").hide();

}
function getGroundFields(typeCompaintVal) {
  var groundChoice = "";
  // SET THE SELECTION FOR THE SELECTED COMPLAINT TYPE
  switch (typeCompaintVal) {
    case "Access to or use of City of Toronto facilities":
      groundChoice = config.groundAccessFacilities.choices;
      break;
    case "Administration or delivery of City of Toronto services":
      groundChoice = config.groundAdministration.choices;
      break;
    case "Employment with the City of Toronto":
      groundChoice = config.groundEmployment.choices;
      break;
    case "Job application with the City of Toronto":
      groundChoice = config.groundJobApplication.choices;
      break;
    case "Legal contracts with the City of Toronto":
      groundChoice = config.groundLegalContracts.choices;
      break;
    case "Occupancy of City of Toronto-owned accommodations":
      groundChoice = config.groundOccupancy.choices;
      break;
    case "Other":
      groundChoice = "";

      $("#groundElement").hide();
      $("#groundOtherElement").show();
      break;
    default:
      $("#groundElement").hide();
      $("#groundOtherElement").hide();
  }


  $("#groundElement fieldset label").remove();
  if (groundChoice != "") {

    $("#groundElement").show();
    $("#groundOtherElement").hide();

    $.each(groundChoice, function (i, item) {
      //    let newVal = '<label class="vertical entryField checkboxLabel col-xs-12 col-sm-6 col-md-4 col-lg-3"><input name="ground[]" id="ground_' + (i) + '" title="Ground" type="checkbox" ';
      let newVal = '<label class="vertical entryField checkboxLabel col-xs-12 col-sm-6 col-md-4 col-lg-3"><input name="ground" data-fv-field="ground" class="required" id="ground_' + (i) + '" title="Ground" type="checkbox" ';
      if (i == 0) {
        //  newVal += 'class="required"  data-fv-field="ground[]" data-fv-notempty data-fv-message="Ground is required" data-fv-notempty-message="Ground can not be empty" ';
        newVal += 'class="required"  data-fv-field="ground" data-fv-notempty data-fv-message="Ground is required" data-fv-notempty-message="Ground can not be empty" ';
        newVal += 'value="' + item.text + '">';
        //    newVal += '<i class="form-control-feedback" data-fv-icon-for="ground[]" style="display: none;"></i>'
        newVal += '<i class="form-control-feedback" data-fv-icon-for="ground" style="display: none;"></i>'
        newVal += '<span>' + item.text + '</span></label>';
      } else {
        newVal += 'value="' + item.text + '"><span>' + item.text + '</span></label>';
      }

      $("#groundElement fieldset").append(newVal);
      $('#hrc').data('formValidation').addField($('#ground_' + i))
    });
  }
}
function employeeToggle(val) {
  let et_val = $('#cotEmployeeType').val();
  let et = $('#cotEmployeeTypeElement');
  let div = $('#cotDivisionElement');
  let jt = $('#cotJobTypeElement');
  if (val == "Yes") {
    et.show();
    div.show();
    et_val == ("Non-union" | "") ? jt.hide() : jt.show();
  } else {
    $('#cotDivision').val('');
    $('#cotEmployeeType').val('');
    $('#cotJobType').val('');
    et.hide();
    div.hide();
    jt.hide();
  }
}
function unionToggle(val) {
  let jt = $('#cotJobTypeElement');
  var cotJobTypeChoice = "";
  $('#cotJobType').val('');
  if ((val === "Union") || (val === "Union executive")) {
    cotJobTypeChoice = config.cotJobTypeUnionList.choices;
    $("#cotJobTypeElement label span").first().text("Union");
  } else if (val === "Non-union") {
    cotJobTypeChoice = config.cotJobTypeNonUnionList.choices;
    $("#cotJobTypeElement label span").first().text("Non-Union");
  } else {
    jt.hide()
  }
  $("#cotJobTypeElement option").remove();
  if (cotJobTypeChoice != "") {
    let i = 0;
    for (i = 0; i < cotJobTypeChoice.length; i++) {
      var newVal = '<option value="' + cotJobTypeChoice[i].value + '">' + cotJobTypeChoice[i].text + '</option>';
      $("#cotJobType").append(newVal);
    }
    jt.show();
    cotJobTypeChoice = "";
  } else {
    jt.hide();
  }
}
function divisionComplaintToggle(val) {
  //  console.log("val"+val);
  let dco = $('#divisionComplaintOtherElement');
  if (val === "Other") {
    dco.show();
  } else {
    dco.hide();
  }
}
function otherToggle(val, listName) {
  let jt = $('#' + listName + 'Element');
  if (val === "Other") {
    jt.show();
  } else {
    $('#' + listName).val('');
    jt.hide();
  }
}
function solutionToggle() {
  if ($("#resolveCompQ").val() === "Yes" || $("#hrtoQ").val() === "Yes" || ($("#grievanceQ").val() === "Yes")) {
    $("#cdText5Element").show();
    $("#moreDetailsElement").show();
  } else {
    $("#cdText5Element").hide();
    $("#moreDetailsElement").hide();
  }
}
function submitForm() {
  //  $("#savebtn").prop('disabled', true);
  let payload = form.getData();
  ///  let payload = getFormJSON("hrc");
  payload.uploads = processUploads(myDropzone, repo, false);

  let queryString = payload.uploads[0] ? "?keepFiles=" + payload.uploads[0].bin_id : "";

  $.ajax({
    url: config.httpHost.app_public[httpHost] + config.api_public.post + repo + queryString,
    type: 'POST',
    data: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json; charset=utf-8;',
      'Cache-Control': 'no-cache'
    },
    dataType: 'json',
    success: function (data) {
      if ((data.EventMessageResponse.Response.StatusCode) == 200) {
        $('#app-content-top').html(config.messages.submit.done);
        //    $('#app-content-bottom').html(app.data["Success Message"]);
      }
    },
    error: function () {
      $('#successFailArea').html(config.messages.submit.fail);
    }
  }).done(function (data) {
  });
}
function processUploads(DZ, repo, sync) {
  let uploadFiles = DZ.existingUploads ? DZ.existingUploads : new Array;
  let _files = DZ.getFilesWithStatus(Dropzone.SUCCESS);
  let syncFiles = sync;
  if (_files.length == 0) {
    //empty
  } else {
    $.each(_files, function (i, row) {
      let json = JSON.parse(row.xhr.response);
      json.name = row.name;
      json.type = row.type;
      json.size = row.size;
      json.bin_id = json.BIN_ID[0];
      delete json.BIN_ID;
      uploadFiles.push(json);
      syncFiles ? '' : '';
    });
  }
  return uploadFiles;
}
function setupDropzone(o) {
  let options = $.extend({
    allowImages: true,
    allowDocuments: true,
    maxFiles: 1
  }, o);

  Dropzone.autoDiscover = false;
  let acceptFiles = options.allowImages ? 'image/gif,image/GIF,image/png,image/PNG,image/jpg,image/JPG,image/jpeg,image/JPEG' : '';
  let fileTypes = options.allowImages ? 'gif, png, jpg, jpeg' : '';

  if (options.allowDocuments) {
    acceptFiles += (acceptFiles ? ',' : '') + 'application/pdf,application/PDF,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    fileTypes += (fileTypes ? ', ' : '') + 'pdf, doc, docx, xls, xlsx, txt, csv, text';
  }

  options.dictDefaultMessage = "Drop file here or <button class='btn-link' aria-label='File Upload - Drop file here or click to upload' type='button'>select</button> to upload.";
  acceptFiles,
    dictInvalidFileType = "Only the following file types are allowed: " + fileTypes,
    options.addRemoveLinks = true;
  options.maxFilesize = 5;
  options.dictFileTooBig = "Maximum size for file attachment is 5 MB";
  options.dictMaxFilesExceeded = "Maximum " + options.maxFiles + " uploaded files";
  return options;
}
function getSubmissionSections() {
  let section = [
    {
      id: "eligibilitySec",
      title: app.data["Eligibility"],
      className: "panel-info",
      rows: [
        {
          fields: [
            { "id": "divisionComplaint", "required": true, "title": app.data["Division"], "type": "dropdown", "choices": config.division.choices, "className": "col-xs-12 col-md-6" },
            { "id": "divisionComplaintOther", "title": "", "type": "html", "html": app.data["Division Other Details"], "className": "col-xs-12 col-md-12" },  // Public only
            {
              "id": "typeComplaint",
              "title": app.data["Type of Complaint"],
              "type": "dropdown",
              "className": "col-xs-10 col-md-6",
              "required": true,
              "choices": config.complaintType.choices,
              "posthelptext": app.data["typeComplaintHelpButton"]
            },
            {
              "id": "ground", "required": true,
              "title": app.data["Ground"],
              "prehelptext": app.data["groundHelpButton"],
              "type": "checkbox",
              "choices": [],
              //    "choices": config.groundAccessFacilities.choices,
              "className": "col-xs-12 col-md-12"
            }
            , { "id": "groundOther", "title": "", "prehelptext": "", "type": "html", "html": app.data["Ground Other Details"], "className": "col-xs-12 col-md-12" } // Public only

          ]
        }
      ]
    },

    {
      id: "contactInfoSec",
      title: app.data["Contact information Section"],
      className: "panel-info",
      rows: [
        {
          fields: [
            { "id": "ciText1", "title": "", "type": "html", "html": app.data["ContactInfoText1"] }
          ]
        },
        {
          fields: [
            { "id": "firstName", "title": app.data["First Name"], "required": true },
            { "id": "lastName", "title": app.data["Last Name"], "required": true }
            //  { "id": "title", "title": app.data["Title"]} // Staff Only
          ]
        },
        {
          fields: [
            { "id": "ciText2", "title": "", "type": "html", "html": app.data["ContactInfoText2"] }
          ]
        },
        {
          fields: [
            { "id": "phone", "title": app.data["Phone"], "required": true, "validationtype": "Phone", "className": "col-xs-12 col-md-6" },
            { "id": "altPhone", "title": app.data["Alternative Phone"], "validationtype": "Phone", "className": "col-xs-12 col-md-6" }
          ]
        },
        {
          fields: [
            { "id": "address", "title": app.data["Address"] },
            { "id": "email", "title": app.data["Email"], "validationtype": "Email", "validators": { regexp: { regexp: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: 'This field must be a valid email. (###@###.####)' } } }
          ]
        },
        {
          fields: [{
            "id": "cityEmployee",
            "orientation": "horizotal",
            "title": app.data["Cot Employee"],
            //   "required": true,
            "type": "radio",
            "value": "No",
            "choices": config.choices.yesNo,
            "className": "col-xs-12 col-md-6",
          }]
        },
        {
          fields: [
            {
              "id": "cotDivision", "title": app.data["cotDivision"], "type": "dropdown", "choices": config.division.choices, "className": "col-xs-12 col-md-4"
              /* ,"validators": {
                 callback: {
                   message: app.data["cotDivision"] + ' is required',
                   // this is added to formValidation
                   callback: function (value, validator, $field) {
                     var checkVal = $('[name=cityEmployee]').val();
                     return (checkVal !== "Yes") ? true : (value !== '');
                   }
                 }
               }*/
            },
            {
              "id": "cotEmployeeType", "title": app.data["cotEmployeeType"], "type": "dropdown", "choices": config.cotEmployeeTypeList.choices, "className": "col-xs-12 col-md-4"
              /* ,"validators": {
                 callback: {
                   message: app.data["cotEmployeeType"] + ' is required',
                   // this is added to formValidation
                   callback: function (value, validator, $field) {
                     var checkVal = $('[name=cityEmployee]').val();
                     return (checkVal !== "Yes") ? true : (value !== '');
                   }
                 }
               }*/
            },
            {
              "id": "cotJobType", "title": app.data["union"], "type": "dropdown", "choices": config.cotJobTypeUnionList.choices, "className": "col-xs-12 col-md-4"
              /*, "validators": {
                callback: {
                  message: 'Job Type is required',
                  // this is added to formValidation
                  callback: function (value, validator, $field) {
                    var checkVal = $('[name=cityEmployee]').val();
                    return (checkVal !== "Yes") ? true : (value !== '');
                  }
                }
              }*/
            }
          ]
        }

      ]
    },
    {
      id: "complaintDetailsSec",
      title: app.data["Complaint Details Section"],
      className: "panel-info",
      rows: [
        {
          fields: [
            { "id": "cdText1", "title": "", "type": "html", "html": app.data["ComplaintDetailText1"], "className": "col-xs-12 col-md-12" }
          ]
        },
        {
          fields: [
            { "id": "incidentDate", "title": app.data["Date of the Incident"], "type": "datetimepicker", "placeholder":config.dateFormat, "options": { format: config.dateFormat, maxDate: new Date() }, "className": "col-xs-12 col-md-4" }
          ]
        },
        {
          fields: [
            { "id": "cdText2", "title": "", "type": "html", "html": app.data["ComplaintDetailText2"] }
          ]
        },
        {
          fields: [
            { "id": "explanation", "title": app.data["Explanation"], "type": "textarea" }
          ]
        },
        {
          fields: [
            { "id": "issue", "prehelptext": app.data["issueHelpButton"], "title": app.data["Issue"], "required": true, "type": "checkbox", "choices": config.issue.choices, "className": "vertical entryField checkboxLabel col-xs-12 col-sm-6 col-md-4 col-lg-3" }
            //"className": "col-xs-12 col-md-6"
            // { "id": "issueHelp", "title": "", "type": "html", "html": "<button type=\"button\" aria-label=\"Issue help button\" class=\"btn btn-primary btn-xs\" id=\"Issue-help\" onclick=\"javascript:void window.open('html//issueHelp.html','1423842457839','width=500,height=500,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');return false;\" >Help</button>" },
          ]
        },
        {
          fields: [
            { "id": "cdText3", "title": "", "type": "html", "html": app.data["ComplaintDetailText3"] }
          ]
        },
     /*   {
          fields: [
            { "id": "cdText4", "title": "", "type": "html", "html": app.data["ComplaintDetailText4"] }
          ]
        },
        {
          fields: [
            { "id": "cdText5", "title": "", "type": "html", "html": app.data["ComplaintDetailText5"] }
          ]
        },
    */    {
          fields: [
            { "id": "complaintDetails", "title": app.data["Complaint Details"], "type": "textarea" }
          ]
        },
        {
          fields: [
            { "id": "docsIntro", "title": "File Attachments", "type": "html", "aria-label": "Dropzone File Upload Control Field", "html": '<section aria-label="File Upload Control Field" id="attachment"> <div class="dropzone" id="admin_dropzone"></div></section>' }
          ]
        },
        {
          fields: [
            { "id": "resolveCompQ", "title": app.data["Resolve complaint"], "type": "dropdown", "orientation": "horizontal", "choices": config.choices.yesNoSelect, "className": "col-xs-12 col-md-6" }
          ]
        },
        {
          fields: [
            { "id": "hrtoQ", "title": app.data["Filed HRTO application"], "type": "dropdown", "orientation": "horizontal", "choices": config.choices.yesNoSelect, "className": "col-xs-12 col-md-6" }
          ]
        },
        {
          fields: [
            { "id": "grievanceQ", "title": app.data["Filed grievance"], "type": "dropdown", "orientation": "horizontal", "choices": config.choices.yesNoSelect, "className": "col-xs-12 col-md-6" }
          ]
        }, {
          fields: [
            { "id": "cdText5", "title": "", "type": "html", "html": app.data["ComplaintDetailText7"] }
          ]
        },
        {
          fields: [
            { "id": "moreDetails", "title": app.data["More details"], "type": "textarea" }
          ]
        }, {
          fields: [
            { "id": "resDesired", "title": app.data["Resolution desired"], "prehelptext": "Describe what resolution you would like happen", "type": "textarea" }
          ]
        },
        {
          fields: [
            { "id": "compAgainst", "title": app.data["Complaint against"], "prehelptext": "Please list all names, separated by semi-colons(;)" }
          ]
        },
        {
          fields: [
            { "id": "footer1", "title": "", "type": "html", "html": app.data["ComplaintDetailText6"] }
          ]
        }
        //    ]
        //  },
        //  {
        //     id: "secActions",
        //     rows: [
        , {
          fields: [
            {
              id: "actionBar",
              type: "html",
              html: `<div className="col-xs-12 col-md-12"><button class="btn btn-success" id="savebtn"><span class="glyphicon glyphicon-send" aria-hidden="true"></span> ` + config.button.submitReport + `</button>
                                   <button class="btn btn-success" id="printbtn"><span class="glyphicon glyphicon-print" aria-hidden="true"></span>Print</button></div>`
              //<button class="btn btn-success" id="closebtn"><span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>Close</button>
            },
            {
              id: "successFailRow",
              type: "html",
              className: "col-xs-12 col-md-12",
              html: `<div id="successFailArea" className="col-xs-12 col-md-12"></div>`
            }
          ]
        },
        {
          fields: [
            {
              id: "help_dialog_grounds",
              type: "html",
              html: `  <div class="modal fade" id="groundsHelp" aria-hidden="true" role="dialog" tabindex="-1" aria-labelledby="groundsHelpTitle" aria-describedby="groundsHelpDesc"><div class="modal-dialog"><div class="modal-content"> <div class="modal-header" id="groundsHelpTitle">
                                  <button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">`+ app.data["groundsHelpHeader"] + `</h4></div>
                                <div class="modal-body" id="groundsHelpDesc"><p>`+ app.data["groundsHelpBody"] + `</p></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>
                  `
            },
            {
              id: "help_dialog_grounds_other",
              type: "html",
              html: `  <div class="modal fade" id="groundsHelpOther" aria-hidden="true" role="dialog" tabindex="-1" aria-labelledby="groundsHelpOtherTitle" aria-describedby="groundsHelpOtherDesc"><div class="modal-dialog"><div class="modal-content"> <div class="modal-header" id="groundsHelpOtherTitle">
                                  <button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">`+ app.data["groundsHelpOtherHeader"] + `</h4></div>
                                <div class="modal-body" id="groundsHelpOtherDesc"><p>`+ app.data["groundsHelpOtherBody"] + `</p></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>
                  `
            },
            {
              id: "help_dialog_Issue",
              type: "html",
              html: `  <div class="modal fade" id="issueComplaintHelp" aria-hidden="true" role="dialog" tabindex="-1" aria-labelledby="issueComplaintHelpTitle" aria-describedby="issueComplaintHelpDesc"><div class="modal-dialog"><div class="modal-content"> <div class="modal-header" id="issueComplaintHelpTitle">
                                  <button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">`+ app.data["issueHelpHeader"] + `</h4></div>
                                <div class="modal-body" id="issueComplaintHelpDesc"><p>`+ app.data["issueHelpBody"] + `</p></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>
                  `
            }
            ,
            {
              id: "help_dialog_Type",
              type: "html",
              html: `<div class="modal fade" id="typeComplaintHelp" aria-hidden="true" role="dialog" tabindex="-1" aria-labelledby="typeComplaintHelpTitle" aria-describedby="typeComplaintHelpDesc"><div class="modal-dialog"><div class="modal-content"> <div class="modal-header" id="typeComplaintHelpTitle">
                                  <button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">`+ app.data["typeOfComplaintHelpHeader"] + `</h4></div>
                                <div class="modal-body" id="typeComplaintHelpDesc"><p>`+ app.data["typeOfComplaintHelpBody"] + `</p></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>
                  `
            }
          ]
        }
        , {
          fields: [{
            "id": "fid",
            "type": "html",
            "html": "<input type=\"text\" id=\"fid\" aria-label=\"Document ID\" aria-hidden=\"true\" name=\"fid\">",
            "class": "hidden"
          }, {
            "id": "action",
            "type": "html",
            "html": "<input type=\"text\" id=\"action\" aria-label=\"Action\" aria-hidden=\"true\" name=\"action\">",
            "class": "hidden"
          }, {
            "id": "createdBy",
            "type": "html",
            "html": "<input type=\"text\" id=\"createdBy\" aria-label=\"Complaint Created By\" aria-hidden=\"true\" name=\"createdBy\">",
            "class": "hidden"
          }, {
            "id": "complaintCreated",
            "type": "html",
            "html": "<input type=\"text\" id=\"complaintCreated\" aria-label=\"Complaint Creation Date\" aria-hidden=\"true\" name=\"complaintCreated\">",
            "class": "hidden"
          }, {
            "id": "yearCreated",
            "type": "html",
            "html": "<input type=\"text\" id=\"yearCreated\" aria-label=\"Complaint Creation Year\" aria-hidden=\"true\" name=\"yearCreated\">",
            "class": "hidden"
          }, {
            "id": "complaintStatus",
            "type": "html",
            "html": "<input type=\"hidden\" aria-label=\"Complaint Status\" aria-hidden=\"true\" id=\"complaintStatus\" name=\"complaintStatus\">",
            "class": "hidden"
          }]

        }
      ]
    }
  ]
  return section;
}


