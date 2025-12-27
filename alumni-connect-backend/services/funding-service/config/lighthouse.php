<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Route URI
    |--------------------------------------------------------------------------
    |
    | Set the URI at which the GraphQL API can be accessed.
    | Do NOT include a leading slash.
    |
    */

    'route' => [
        'uri' => 'graphql',
        'middleware' => [
            \App\Http\Middleware\JwtAuth::class,
        ],
        'name' => 'graphql',
    ],

    /*
    |--------------------------------------------------------------------------
    | Schema Path
    |--------------------------------------------------------------------------
    |
    | Path to your .graphql schema file.
    | Additional schema files may be imported from within that file.
    |
    */

    'schema' => [
        'register' => base_path('graphql/schema.graphql'),
    ],

    /*
    |--------------------------------------------------------------------------
    | GraphQL Controller
    |--------------------------------------------------------------------------
    |
    | Specify which controller to use.
    |
    */

    'controller' => \Nuwave\Lighthouse\Support\Http\Controllers\GraphQLController::class,

    /*
    |--------------------------------------------------------------------------
    | Namespaces
    |--------------------------------------------------------------------------
    |
    | These are the default namespaces where Lighthouse looks for classes.
    |
    */

    'namespaces' => [
        'models' => 'App\\Models',
        'queries' => 'App\\GraphQL\\Queries',
        'mutations' => 'App\\GraphQL\\Mutations',
        'subscriptions' => 'App\\GraphQL\\Subscriptions',
        'interfaces' => 'App\\GraphQL\\Interfaces',
        'unions' => 'App\\GraphQL\\Unions',
        'scalars' => 'App\\GraphQL\\Scalars',
        'directives' => 'App\\GraphQL\\Directives',
    ],

    /*
    |--------------------------------------------------------------------------
    | GraphQL Playground
    |--------------------------------------------------------------------------
    |
    | Enable the GraphQL Playground feature.
    |
    */

    'playground' => [
        'enabled' => env('LIGHTHOUSE_PLAYGROUND_ENABLED', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Security
    |--------------------------------------------------------------------------
    |
    | Control security related features.
    |
    */

    'security' => [
        'max_query_complexity' => 250,
        'max_query_depth' => 10,
        'disable_introspection' => env('LIGHTHOUSE_SECURITY_DISABLE_INTROSPECTION', false),
    ],

    /*
    |--------------------------------------------------------------------------
    | Apollo Federation
    |--------------------------------------------------------------------------
    |
    | Lighthouse can act as a federated service.
    |
    */

    'federation' => [
        'entities_resolver_namespace' => 'App\\GraphQL\\Entities',
    ],

    /*
    |--------------------------------------------------------------------------
    | Global ID
    |--------------------------------------------------------------------------
    |
    | The name that is used for the global id field on the Node interface.
    |
    */

    'global_id_field' => '_id',

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    |
    | Configuration for the pagination features.
    |
    */

    'pagination' => [
        'default_count' => 15,
        'max_count' => 100,
    ],

    /*
    |--------------------------------------------------------------------------
    | Transactional Mutations
    |--------------------------------------------------------------------------
    |
    | If set to true, mutations will be wrapped in a transaction.
    |
    */

    'transactional_mutations' => true,

    /*
    |--------------------------------------------------------------------------
    | Mass Assignment Protection
    |--------------------------------------------------------------------------
    |
    | If set to true, mutations will be wrapped in a transaction.
    |
    */

    'force_fill' => false,

];
