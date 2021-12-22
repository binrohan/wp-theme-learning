<?php
function university_post_types() {
  // Event Post Type
  register_post_type('event', array(
    'rewrite' => array('slug' => 'events'),
    'show_in_rest' => true,
    'supports' => array('title', 'editor', 'excerpt'),
    'has_archive' => true,
    'public' => true,
    'labels' => array(
      'name' => 'Events',
      'add_new_item' => 'Add New Event',
      'edit_item' => 'Edit Event',
      'all_items' => 'All Events',
      'singular_name' => 'Event'
    ),
    'menu_icon' => 'dashicons-calendar'
    
  ));

  // Program Post Type
  register_post_type('program', array(
    'rewrite' => array('slug' => 'programs'),
    'show_in_rest' => true,
    'supports' => array('title', 'editor'),
    'has_archive' => true,
    'public' => true,
    'labels' => array(
      'name' => 'Programs',
      'add_new_item' => 'Add New Program',
      'edit_item' => 'Edit Program',
      'all_items' => 'All Programs',
      'singular_name' => 'Program'
    ),
    'menu_icon' => 'dashicons-awards'
  ));

  // Professor Post Type
  register_post_type('professor', array(
    'show_in_rest' => true,
    'supports' => array('title', 'editor', 'thumbnail'),
    'public' => true,
    'labels' => array(
      'name' => 'Professors',
      'add_new_item' => 'Add New Professor',
      'edit_item' => 'Edit Professor',
      'all_items' => 'All Professors',
      'singular_name' => 'Professor'
    ),
    'menu_icon' => 'dashicons-welcome-learn-more'
  ));

  // Campus Post Type
  register_post_type('campus', array(
    'rewrite' => array('slug' => 'Campuses'),
    'show_in_rest' => true,
    'supports' => array('title', 'editor'),
    'has_archive' => true,
    'public' => true,
    'labels' => array(
      'name' => 'Campuses',
      'add_new_item' => 'Add New Campus',
      'edit_item' => 'Edit Campus',
      'all_items' => 'All Campuses',
      'singular_name' => 'Campus'
    ),
    'menu_icon' => 'dashicons-location-alt'
  ));
}

add_action('init', 'university_post_types');

// http://amazingcollege.local