<?php

add_action('rest_api_init', 'university_register_search');

function university_register_search()
{
    register_rest_route('university/v1', 'search', array(
        'methods' => WP_REST_SERVER::READABLE,
        'callback' => 'university_search_result',
    ));
}

function university_search_result($data)
{
    $mainQuery = new WP_Query(array(
        'post_type' => array('post', 'page', 'professor', 'program', 'campus', 'event'),
        'posts_per_page' => -1,
        's' => sanitize_text_field($data['term'])
    ));

    $results = array(
        'generalInfo' => array(),
        'professors' => array(),
        'programs' => array(),
        'campuses' => array(),
        'events' => array()
    );

    while ($mainQuery->have_posts()) {
        $mainQuery->the_post();

        if (get_post_type() === 'post' or get_post_type() === 'page') {
            array_push($results['generalInfo'], array(
                'title' => get_the_title(),
                'permaLink' => get_the_permalink(),
                'postType' => get_post_type(),
                'authorName' => get_the_author()
            ));
        }
        if (get_post_type() === 'professor') {
            array_push($results['professors'], array(
                'title' => get_the_title(),
                'permaLink' => get_the_permalink(),
                'image' => get_the_post_thumbnail_url(0, 'professorLandscape', 'Professor Profile picture')
            ));
        }
        if (get_post_type() === 'program') {
            $relatedCampuses = get_field('related_campus');

            if ($relatedCampuses) {
                foreach($relatedCampuses as $campus){
                    array_push($results['campuses'], array(
                        'title' => get_the_title($campus),
                        'permaLink' => get_the_permalink($campus)
                    ));
                }
            }

            array_push($results['programs'], array(
                'title' => get_the_title(),
                'permaLink' => get_the_permalink(),
                'id' => get_the_ID()
            ));
        }
        if (get_post_type() === 'campus') {
            array_push($results['campuses'], array(
                'title' => get_the_title(),
                'permaLink' => get_the_permalink()
            ));
        }
        if (get_post_type() === 'event') {
            $eventDate = new DateTime(get_field('event_date'));
            $excerpt = null;
            if (has_excerpt()) {
                $excerpt = get_the_excerpt();
            } else {
                $excerpt = wp_trim_words(get_the_content(), 18);
            }

            array_push($results['events'], array(
                'title' => get_the_title(),
                'permaLink' => get_the_permalink(),
                'month' => $eventDate->format('M'),
                'day' => $eventDate->format('d'),
                'excerpt' => $excerpt
            ));
        }
    }

    if(!$results['programs']){
        return $results;
    }

    $programMetaQuery = array('relation' => 'OR');

    foreach($results['programs'] as $item){
        array_push($programMetaQuery, array(
            'key' => 'related_programs',
            'compare' => 'LIKE',
            'value' => '"' . $item['id'] . '"',
        ));
    }

    $programRelationShipQuery = new WP_Query(array(
        'post_type' => array('professor', 'event'),
        'meta_query' => $programMetaQuery
    ));

    while ($programRelationShipQuery->have_posts()) {
        $programRelationShipQuery->the_post();

        if (get_post_type() === 'event') {
            $eventDate = new DateTime(get_field('event_date'));
            $excerpt = null;
            if (has_excerpt()) {
                $excerpt = get_the_excerpt();
            } else {
                $excerpt = wp_trim_words(get_the_content(), 18);
            }

            array_push($results['events'], array(
                'title' => get_the_title(),
                'permaLink' => get_the_permalink(),
                'month' => $eventDate->format('M'),
                'day' => $eventDate->format('d'),
                'excerpt' => $excerpt
            ));
        }

        if (get_post_type() === 'professor') {
            array_push($results['professors'], array(
                'title' => get_the_title(),
                'permaLink' => get_the_permalink(),
                'image' => get_the_post_thumbnail_url(0, 'professorLandscape', 'Professor Profile picture')
            ));
        }
    }

    $results['professors'] = array_values(array_unique($results['professors'], SORT_REGULAR));
    $results['events'] = array_values(array_unique($results['events'], SORT_REGULAR));
    $results['campuses'] = array_values(array_unique($results['campuses'], SORT_REGULAR));

    return $results;
}
