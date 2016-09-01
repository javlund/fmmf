/**
 * Created by avlund on 20/06/15.
 */

requirejs.config({
    baseUrl : 'bower_components',
    enforceDefine : true,
    paths : {
        jquery : 'jquery/dist/jquery',
        underscore : 'underscore/underscore',
        backbone : 'backbone/backbone',
        marionette : 'marionette/lib/backbone.marionette',
        syphon : 'marionette.backbone.syphon/lib/backbone.syphon',
        i18next : 'i18next/i18next.amd',
        moment : 'moment/moment',
        bootstrap : 'bootstrap/dist/js/bootstrap',
        datetimepicker : 'eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker'
    },
    shim : {
        bootstrap : {
            deps : ['jquery'],
            exports : '$.fn.popover'
        }
    }
});

define(['jquery', 'backbone', 'marionette', 'i18next', 'datetimepicker', 'syphon'], function ($, Backbone, Marionette, i18n) {
    'use strict';
    var app, Member, RootView, SignupView, language, enter, exit, languageLoaded, changeLanguage, signup;

    app = new Backbone.Marionette.Application({

    });

    Member = Backbone.Model.extend({
        url : 'php/members/signup',
        defaults :  {
            name : '',
            email : '',
            address : '',
            zip : '',
            country : '',
            birthdate : ''
        }
    });

    app.member = new Member();

    var RootView = Marionette.LayoutView.extend({
        el : 'body',
        regions : {
            form : '#signupform'
        }
    });

    app.rootView = new RootView();

    app.changeLanguage = function () {
        language = language === 'da' ? 'en' : 'da';
        i18n.setLng(language, languageLoaded);
    };

    SignupView = Marionette.ItemView.extend({
        events : {
            'click #signup' : 'signup'
        },
        template : '#signuptemplate',
        onRender : function () {
            this.$el.find('#birthdate').datetimepicker({
                format : 'DD-MM-YYYY',
                keepOpen : true
            });

            this.$el.find('input:first').focus();
        },
        signup : function (event) {
            event.preventDefault();
            var data = Backbone.Syphon.serialize(this);
            this.model.set(data);
            this.model.save();
        }
    });

    app.signupView = new SignupView({
        model : app.member
    });

    app.rootView.form.show(app.signupView);

    enter = function (element) {
        $(element).addClass('animated pulse');
    };

    exit = function (element) {
        $(element).removeClass('pulse');
    };

    languageLoaded = function () {
        $('.form-group').each(function () {
            var key = $(this).data('t');
            if (key) {
                $(this).children('label:first').html(i18n.t(key));
                $(this).children('input:first').attr('placeholder', i18n.t(key));
                $(this).children('button:first').html(i18n.t(key));
            }
        });
    };

    app.start();

    $(document).ready(function () {
        $('#changelanguage').click(function (event) {
            event.preventDefault();
            app.changeLanguage();
        });

        language = 'da';
        i18n.init({
            lng : language,
            resGetPath : 'json/lang___lng__.json',
            fallbackLng : false
        }, languageLoaded);

        $('input').focus(function () {
            enter(this);
        });

        $('input').blur(function () {
            exit(this);
        });

    });
});