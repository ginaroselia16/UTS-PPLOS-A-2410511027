<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index()
    {
        $employees = Employee::all();
        return response()->json($employees);
    }

    public function store(Request $request)
    {
        $employee = Employee::create([
            'name' => $request->name,
            'position' => $request->position,
            'salary' => $request->salary,
        ]);

        return response()->json([
            'message' => 'Employee created',
            'data' => $employee
        ], 201);
    }

    public function show($id)
    {
        $employee = Employee::findOrFail($id);
        return response()->json($employee);
    }

    public function update(Request $request, $id)
    {
        $employee = Employee::findOrFail($id);

        $employee->update([
            'name' => $request->name,
            'position' => $request->position,
            'salary' => $request->salary,
        ]);

        return response()->json([
            'message' => 'Employee updated',
            'data' => $employee
        ]);
    }

    public function destroy($id)
    {
        Employee::destroy($id);

        return response()->json([
            'message' => 'Employee deleted'
        ]);
    }
}