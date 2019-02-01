<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        \Schema::disableForeignKeyConstraints();
        \DB::table('users')->truncate();
        \DB::table('products')->truncate();
        $this->call(UserSeeder::class);
        $this->call(ProductSeeder::class);
    }
}
