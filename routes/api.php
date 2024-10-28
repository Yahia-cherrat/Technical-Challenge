<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContractArticleController;

// Route to get authenticated user details
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// ContractArticles Routes
Route::get('/contract-articles', [ContractArticleController::class, 'index']);
Route::post('/contract-articles', [ContractArticleController::class, 'store']);
Route::get('/contract-articles/{id}', [ContractArticleController::class, 'show']);
Route::put('/contract-articles/{id}', [ContractArticleController::class, 'update']);
Route::delete('/contract-articles/{id}', [ContractArticleController::class, 'destroy']);
