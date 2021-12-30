<?php
/*
Plugin Name: My First Amazing Plugin
Description: This is cool
*/

function amazing_content_edits($content){
    $content = str_replace('Lorem', '*****', $content);
    $content = $content . '<p> All content belongs to frictional university </p>';

    return $content;
}

add_filter('the_content', 'amazing_content_edits');


function get_program_count() {
    return 69;
}

add_shortcode('programCount', 'get_program_count');
