<?php

use Faker\Generator as Faker;

$factory->define(\App\Models\Product::class, function (Faker $faker) {
    return [
        'name' => $faker->jobTitle,
        'slug' => $faker->slug,
        'short_description' => $faker->text(100),
        'description' => $faker->text(500),
        'price' => $faker->randomFloat(1, 0, 10000),
        'creator_id' => 3,
        'category_id' => 1,
    ];
});
