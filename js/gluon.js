$(function() {
    // constants
    var MIN_JDK = "23";
    var MIN_JDK_LTS = "21";
    var JDK_MAJOR = "24";
    var JFX_MAJOR = "25";
    
    var JFX_VERSION = "25.0.2";
    var JFX_LTS_VERSION = "17 or 21";
    var JFX_PLUGIN_VERSION = "0.1.0";
    var JFX_MVN_PLUGIN_VERSION = "0.0.8";
    var JFX_MVN_ARCH_VERSION = "0.0.6";
    var JLINK_PLUGIN_VERSION = "3.1.1";

    var nav_top = 70;
        
    // Hide all non-active div
    $('.hidden').hide();
    
    // Navigate to anchor if the url has hash
    var anchorHash = window.location.hash;
    if (anchorHash.length > 1) {
        loadContent($('a[href="' + anchorHash + '"]'));
    }
    
    // Make sure correct anchor links are loaded when url changes
    $(window).bind('hashchange', function () {
        var hash = window.location.hash.slice(1);
        loadContent($('a[href="#' + hash + '"]'));
        scrollTo(0, 0);
    });
    
    // Click on anchor links should load content
    $('a[href^="#"]').on('click', function() {
        // TODO: Has performance issues
        // $('a[data-toggle="collapse"][class!="collapsed"]').click();
        var childNode = $(this).find('[href$="-plugin"]');
        if (childNode != null) {
            var dataParent = $(this).attr('data-parent');
            if (dataParent == null) {
                var href = $(this).attr('href');
                var dp = $('a[href="' + href + '"]').not(this).attr('data-parent');
                if (dp != null) {
                    // TODO: shouldn't close when already open
                    $('a[href="' + dp + '"][data-parent="' + dp + '"]').click();
                }
            }
        }
        loadContent(this);
    });
    
    // open group, close rest of groups
    $(".list-group-item .ref-group").click(function(e) {
        e.preventDefault();
        var $target = $(this).closest('li').find("ul.list-group-sub").slideToggle();
        $('html,body').scrollTop(0);
        $('ul.list-group-sub').not($target).slideUp();
    });
    // close opened groups
    $(".list-group-item").click(function(e) {
        if (! $(this).children().length > 0) {
            $('ul.list-group-sub').slideUp();
        }
    });
    
    // Add href to report a problem buttons
    /*$('a[data-section]').each(function() {
        var emailWithSubject = "https://gluonhq.com/about-us/contact-us/?comment=" + 
            encodeURIComponent("Problem with Getting Started in section '") +
            encodeURIComponent($(this).attr('data-section') + "'") +
            encodeURIComponent("\n\nDescribe the problem: ");
        $(this).attr('href', emailWithSubject);
    });*/
    $('a[data-section]').each(function() {
        $(this).attr('href', 'https://github.com/openjfx/openjfx-docs/issues');
    });

    // All tabs showing code should be linked
    $(document).on('click', 'a[class="nav-link"][data-toggle="tab"]', function(e) {
        e.preventDefault();
        var href = $(this).attr('href');
        var os = href.split("-")[0]; // #win or #nix
        $('a[class="nav-link"][data-toggle="tab"][href^="' + os + '"]').each(function() {
            $(this).tab('show');
        });
    });
    
    $(document).on('click', '.modular-jlink-action', function(event) {
        event.preventDefault(); 
        var anchor = $('.jlink');
        $('html,body').scrollTop($(anchor).offset().top);
    });
    
    // Scroll to anchor from list-group-sub links
    $(document).on('click', ".scrollto", function(event) {
        event.preventDefault(); 
        var anchor = $(this).attr('data-scroll');
        $('html,body').scrollTop($(anchor).offset().top - nav_top);
    });
    
    // Scroll to anchor from navbar-nav links
    $(document).on('click', 'a[class*="nav-link"][data-toggle="collapse"]', function(event) {
        event.preventDefault(); 
        var href = $(this).attr('href');
        var anchor = $(this).attr('data-scroll');
        if (anchor != null) {
            $('html,body').scrollTop($(anchor).offset().top - nav_top);
        } else {
            $('html,body').scrollTop($(href).offset().top - nav_top);
        }
    });
    
    // Replace all constants
    // sticky sidenav
    $(document).ready(function() {
        nav_top = $('.navbar').height();
        var div_top = $('.content').offset().top;
        $(window).scroll(function() {
            if ($('.navbar-toggler').attr('aria-expanded') === "true") {
                // collapse navbar
                $('.navbar-toggler').click();
            }  
            var windowTop = $(window).scrollTop() + nav_top;
            if (windowTop > div_top) {
                $('.sidenav').css('top', windowTop);  
            } else {
                $('.sidenav').css('top', div_top);  
            } 
        });
    });

    // TODO: Find a better lib to include local html files
    // Because we are using the csi js lib to include the pages,
    // this doesn't work on document ready
    
    // Replace all $ with non-selectable span
    setTimeout(function() {
        $('.MIN_JDK').each(function() { $(this).text(MIN_JDK) });
        $('.JDK_MAJOR').each(function() { $(this).text(JDK_MAJOR) });
        $('.JFX_MAJOR').each(function() { $(this).text(JFX_MAJOR) });
        $('.JFX_VERSION').each(function() { $(this).text(JFX_VERSION) });
        $('.JFX_LTS_VERSION').each(function() { $(this).text(JFX_LTS_VERSION) });
        $('.JFX_PLUGIN_VERSION').each(function() { $(this).text(JFX_PLUGIN_VERSION) });
        $('.JFX_MVN_PLUGIN_VERSION').each(function() { $(this).text(JFX_MVN_PLUGIN_VERSION) });
        $('.JFX_MVN_ARCH_VERSION').each(function() { $(this).text(JFX_MVN_ARCH_VERSION) });
        $('.JLINK_PLUGIN_VERSION').each(function() { $(this).text(JLINK_PLUGIN_VERSION) });

        nav_top = $('.navbar').height();
        
        $('code').each(function () {
            var content = $(this).html();
            var unselectableContent  = replaceAll(content, "$ ", "<span class=\"no-select\">$ </span>");
            $(this).html(unselectableContent);
        });
        // Replace OpenJDK link with latest version
        $('a[id="jdk-download-link"]').each(function() {
            $(this).attr('href', 'http://jdk.java.net/' + JDK_MAJOR);
        });
    }, 1000);

    // Load content
    function loadContent(hyperlink) {
        // Activate link only if there aren't parent nodes
        var dataRemote = $(hyperlink).attr('data-remote');
        if (dataRemote == null) {
            
            var target = $(hyperlink).attr('href');
            if (target != null) {

                // Show div and hide all siblings
                $(target).show().siblings(".content div").hide();

                // Remove active from all links in nav-bar
                $('a[class*="nav-link"][data-toggle="collapse"],a[class*="list-group-item"],li[class*="list-group-item"]').removeClass("active");

                if ($(hyperlink).hasClass('list-group-item') || $(hyperlink).hasClass('nav-link')) {
                    $(hyperlink).addClass("active");
                } else if ($(hyperlink).parent(".checked").hasClass('list-group-item')) {
                    $(hyperlink).parent(".checked").addClass("active");
                }
            }
        }
    }
    
    function replaceAll(str, find, replace) {
        return str.split(find).join(replace);
    }

    // for `<div data-include=..>` to include html files
    $(function () {
        var includes = $('[data-include]');
        $.each(includes, function () {
        var file = $(this).data('include');
        $(this).load(file);
        });
    });
});
