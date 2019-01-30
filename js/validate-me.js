"use strict";
$(document).ready(function() {
  $("#contact_form")
    .bootstrapValidator({
      // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
      feedbackIcons: {
        valid: "glyphicon glyphicon-ok",
        invalid: "glyphicon glyphicon-remove",
        validating: "glyphicon glyphicon-refresh"
      },
      fields: {
        name: {
          validators: {
            stringLength: {
              min: 3,
              max: 60,
              message: "Please enter at least 3 characters and no more than 60"
            },
            notEmpty: {
              message: "Please supply your first name"
            },
            regexp: {
              regexp: /^[a-zA-Z]+$/
            }
          }
        },
        secondname: {
          validators: {
            stringLength: {
              min: 3,
              max: 60,
              message: "Please enter at least 3 characters and no more than 60"
            },
            notEmpty: {
              message: "Please supply your last name"
            },
            regexp: {
              regexp: /^[a-zA-Z]+$/
            }
          }
        },
        email: {
          validators: {
            notEmpty: {
              message: "Please supply your email address"
            },
            emailAddress: {
              message: "Please supply a valid email address"
            }
          }
        },
        gender: {
          validators: {
            notEmpty: {
              message: "Please select your gender"
            }
          }
        },
        pass: {
          validators: {
            stringLength: {
              min: 8,
              max: 256,
              message: "Please enter at least 8 characters and no more than 200"
            },
            notEmpty: {
              message: "Please supply a description of your project"
            }
          }
        },
        agreement: {
          validators: {
            notEmpty: {
              message: "You must agree with the terms and conditions"
            }
          }
        }
      }
    })
    .submit(function(e) {
      var $form = $(this);
      $.ajax({
        type: $form.attr("method"),
        url: $form.attr("action"),
        data: $form.serialize(),
        success: function(response) {
          console.log(response);
          if (response.status !== "OK") {
            $("#warning_message")
              .slideDown({ opacity: "show" }, "slow")
              .html(
                '<i class="glyphicon glyphicon-warning-sign"></i> ' +
                  response.message
              );
          } else {
            document.location.href = "company.html";
          }
        }
      });
      
      e.preventDefault();
    });
});
