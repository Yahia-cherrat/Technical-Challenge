<?php

namespace App\Http\Controllers;

use App\Models\ContractArticle;
use Illuminate\Http\Request;

class ContractArticleController extends Controller
{
    // GET: List all contract articles
    public function index()
    {
        return ContractArticle::all();
    }

    // GET: Show a specific contract article
    public function show($id)
    {
        return ContractArticle::findOrFail($id);
    }

    // POST: Create a new contract article
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        return ContractArticle::create([
            'title' => $request->title,
            'content' => $request->content,
        ]);
    }

    // PUT: Update an existing contract article
    public function update(Request $request, $id)
    {
        $contractArticle = ContractArticle::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $contractArticle->update($request->all());

        return $contractArticle;
    }

    // DELETE: Remove a contract article
    public function destroy($id)
    {
        $contractArticle = ContractArticle::findOrFail($id);
        $contractArticle->delete();

        return response()->noContent();
    }
}
