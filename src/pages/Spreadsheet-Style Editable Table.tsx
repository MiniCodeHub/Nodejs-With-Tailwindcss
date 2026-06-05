import { useState } from "react";

type Employee = {
  id: number;
  name: string;
  role: string;
  salary: number;
};

export default function App() {
  const [employees, setEmployees] =
    useState<Employee[]>([
      {
        id: 1,
        name: "John Doe",
        role: "Frontend Developer",
        salary: 70000,
      },
      {
        id: 2,
        name: "Sarah Smith",
        role: "UI Designer",
        salary: 65000,
      },
      {
        id: 3,
        name: "Michael Brown",
        role: "Backend Developer",
        salary: 80000,
      },
    ]);

  const handleChange = (
    id: number,
    field: keyof Employee,
    value: string
  ) => {
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === id
          ? {
              ...employee,
              [field]:
                field === "salary"
                  ? Number(value)
                  : value,
            }
          : employee
      )
    );
  };

  const addRow = () => {
    const newEmployee: Employee = {
      id: Date.now(),
      name: "",
      role: "",
      salary: 0,
    };

    setEmployees([
      ...employees,
      newEmployee,
    ]);
  };

  const deleteRow = (id: number) => {
    setEmployees(
      employees.filter(
        (employee) =>
          employee.id !== id
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white">
              Editable Spreadsheet
            </h1>

            <p className="text-slate-400 mt-2">
              React + Tailwind Table Editor
            </p>
          </div>

          <button
            onClick={addRow}
            className="
              px-5 py-3
              bg-cyan-500
              hover:bg-cyan-400
              text-black
              font-semibold
              rounded-lg
              transition
            "
          >
            Add Row
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">

          <table className="w-full">

            <thead className="bg-slate-900">

              <tr>
                <th className="p-4 text-left text-slate-300">
                  Name
                </th>

                <th className="p-4 text-left text-slate-300">
                  Role
                </th>

                <th className="p-4 text-left text-slate-300">
                  Salary
                </th>

                <th className="p-4 text-center text-slate-300">
                  Action
                </th>
              </tr>

            </thead>

            <tbody>

              {employees.map(
                (employee) => (
                  <tr
                    key={employee.id}
                    className="
                      border-t
                      border-slate-800
                      bg-slate-950
                    "
                  >
                    <td className="p-3">

                      <input
                        type="text"
                        value={employee.name}
                        onChange={(e) =>
                          handleChange(
                            employee.id,
                            "name",
                            e.target.value
                          )
                        }
                        className="
                          w-full
                          bg-slate-900
                          text-white
                          px-3
                          py-2
                          rounded-lg
                          border
                          border-slate-700
                          focus:outline-none
                          focus:border-cyan-500
                        "
                      />

                    </td>

                    <td className="p-3">

                      <input
                        type="text"
                        value={employee.role}
                        onChange={(e) =>
                          handleChange(
                            employee.id,
                            "role",
                            e.target.value
                          )
                        }
                        className="
                          w-full
                          bg-slate-900
                          text-white
                          px-3
                          py-2
                          rounded-lg
                          border
                          border-slate-700
                          focus:outline-none
                          focus:border-cyan-500
                        "
                      />

                    </td>

                    <td className="p-3">

                      <input
                        type="number"
                        value={employee.salary}
                        onChange={(e) =>
                          handleChange(
                            employee.id,
                            "salary",
                            e.target.value
                          )
                        }
                        className="
                          w-full
                          bg-slate-900
                          text-white
                          px-3
                          py-2
                          rounded-lg
                          border
                          border-slate-700
                          focus:outline-none
                          focus:border-cyan-500
                        "
                      />

                    </td>

                    <td className="p-3 text-center">

                      <button
                        onClick={() =>
                          deleteRow(
                            employee.id
                          )
                        }
                        className="
                          px-4 py-2
                          bg-red-500
                          hover:bg-red-400
                          text-white
                          rounded-lg
                          transition
                        "
                      >
                        Delete
                      </button>

                    </td>
                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <p className="text-slate-400 text-sm">
              Total Employees
            </p>

            <h2 className="text-2xl font-bold text-white">
              {employees.length}
            </h2>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <p className="text-slate-400 text-sm">
              Total Payroll
            </p>

            <h2 className="text-2xl font-bold text-white">
              $
              {employees
                .reduce(
                  (
                    sum,
                    employee
                  ) =>
                    sum +
                    employee.salary,
                  0
                )
                .toLocaleString()}
            </h2>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <p className="text-slate-400 text-sm">
              Editable Cells
            </p>

            <h2 className="text-2xl font-bold text-white">
              {employees.length * 3}
            </h2>
          </div>

        </div>

      </div>
    </div>
  );
}