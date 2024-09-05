import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface Material {
  id: number;
  name: string;
  quantity: number;
  rate: number;
  total: number;
}

interface Task {
  id: number;
  name: string;
  description: string;
  quantity: number;
  rate: number;
  materials: Material[];
  total: number;
  materialTotal: number;
  taskTotal: number;
}

interface Group {
  id: number;
  name: string;
  netTotal: number;
  discount: number;
  grandTotal: number;
  tasks: Task[];
}

interface FormValues {
  id: number;
  groups: Group[];
}

const schema = yup.object().shape({
  groups: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Group name is required"),
      discount: yup.number().positive().required("Discount is required"),
      tasks: yup.array().of(
        yup.object().shape({
          name: yup.string().required("Task name is required"),
          description: yup.string().required("Task description is required"),
          quantity: yup.number().positive().required("Quantity is required"),
          rate: yup.number().positive().required("Rate is required"),
          materials: yup.array().of(
            yup.object().shape({
              name: yup.string().required("Material name is required"),
              quantity: yup.number().positive().required("Material quantity is required"),
              rate: yup.number().positive().required("Material rate is required"),
            })
          )
        })
      )
    })
  ),
});

const Home = () => {


  const [groups, setGroups] = useState<Group[]>(
    [
      {
        id: 1,
        name: "",
        tasks: [
          {
            id: 1,
            name: "",
            description: "",
            quantity: 0,
            rate: 0,
            total: 0,
            materialTotal: 0,
            taskTotal: 0,
            materials: [
              {
                id: 1,
                name: "",
                quantity: 0,
                rate: 0,
                total: 0
              }]
          }
        ],
        netTotal: 0,
        discount: 0,
        grandTotal: 0
      }
    ]);
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    //@ts-ignore
    resolver: yupResolver(schema),
    defaultValues: {
      groups: groups
    }
  });

  const onSubmit = (data: FormValues) => {
    const updatedGroups = data.groups.map(group => {
      const updatedTasks = group.tasks.map(task => {
        // Calculate material totals
        const updatedMaterials = task.materials.map(material => ({
          ...material,
          total: material.quantity * material.rate
        }));

        // Calculate task totals
        const materialTotal = updatedMaterials.reduce((sum, material) => sum + material.total, 0);

        return {
          ...task,
          materials: updatedMaterials,
          materialTotal,
          total: task.quantity * task.rate,
          taskTotal: (task.quantity * task.rate) + materialTotal
        };
      });

      // Calculate group totals
      const netTotal = updatedTasks.reduce((sum, task) => sum + task.taskTotal, 0);
      const grandTotal = netTotal - group.discount;

      return {
        ...group,
        tasks: updatedTasks,
        netTotal,
        grandTotal
      };
    });

    console.log("updatedGroups", updatedGroups);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-100 p-4 rounded-md shadow-md">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold mb-2">Project Form </h1>
          <button
            type="button"
            onClick={() => {
              let _groups = [...groups];
              _groups.push(
                {
                  id: _groups[_groups.length - 1].id + 1,
                  name: "",
                  tasks: [
                    {
                      id: 1,
                      name: "",
                      description: "",
                      quantity: 0,
                      rate: 0,
                      total: 0,
                      materialTotal: 0,
                      taskTotal: 0,
                      materials: [
                        {
                          id: 1,
                          name: "",
                          quantity: 0,
                          rate: 0,
                          total: 0
                        }]
                    }
                  ],
                  netTotal: 0,
                  discount: 0,
                  grandTotal: 0
                });
              setGroups([..._groups]);
            }}
            className="bg-blue-500 text-white py-1 mb-2 px-3 rounded-md hover:bg-blue-600"
          >
            Add Group
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {groups.map((group, groupIndex) => (
            <>
              <div key={group.id + groupIndex} className="mb-6 p-4 border rounded-md bg-white">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-gray-700">Group Name</label>
                    {groups.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          let _groups = [...groups];
                          _groups = _groups.filter((data) => data.id != group.id);
                          setGroups([..._groups]);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove Group
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    {...register(`groups.${groupIndex}.name` as const)}
                    className={`w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 ${errors.groups?.[groupIndex]?.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                      }`}
                  />
                  {errors.groups?.[groupIndex]?.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.groups[groupIndex].name?.message}
                    </p>
                  )}
                </div>

                {/* Tasks Section */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold text-gray-700">Tasks</h3>
                    <button
                      type="button"
                      onClick={() => {

                        let _groups = [...groups];
                        for (let row of _groups) {
                          if (row.id == group.id) {
                            row.tasks.push(
                              {
                                id: row.tasks[row.tasks.length - 1].id + 1,
                                name: "",
                                description: "",
                                quantity: 0,
                                rate: 0,
                                total: 0,
                                materialTotal: 0,
                                taskTotal: 0,
                                materials: [
                                  {
                                    id: 1,
                                    name: "",
                                    quantity: 0,
                                    rate: 0,
                                    total: 0
                                  }]
                              }
                            );
                          }
                        }
                        setGroups([..._groups]);
                      }}
                      className="flex items-center bg-blue-500 text-white py-1 mb-2 px-3 rounded-md hover:bg-blue-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Add Task
                    </button>
                  </div>

                  {/* Iterate over tasks and use a field array for materials */}
                  {group?.tasks?.map((task, taskIndex) => {
                    return (
                      <div key={task.name + taskIndex + groupIndex} className="mb-4 p-4 border rounded-md bg-white">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-lg font-semibold text-gray-700">Task {taskIndex + 1}</h4>
                          {group.tasks.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                let _groups = [...groups];

                                for (let row of _groups) {
                                  if (row.id == group.id) {
                                    row.tasks = row.tasks.filter((_data) => _data.id != task.id);
                                  }
                                }
                                setGroups([..._groups]);

                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove Task
                            </button>
                          )}
                        </div>
                        <div className="mb-2">
                          <label className="block text-gray-700">Task Name</label>
                          <input
                            type="text"
                            {...register(`groups.${groupIndex}.tasks.${taskIndex}.name` as const)}
                            className={`w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 ${errors.groups?.[groupIndex]?.tasks?.[taskIndex]?.name
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                              }`}
                          />
                          {errors.groups?.[groupIndex]?.tasks?.[taskIndex]?.name && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.groups[groupIndex].tasks[taskIndex].name?.message}
                            </p>
                          )}
                        </div>
                        <div className="mb-2">
                          <label className="block text-gray-700">Description</label>
                          <input
                            type="text"
                            {...register(`groups.${groupIndex}.tasks.${taskIndex}.description` as const)}
                            className={`w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 ${errors.groups?.[groupIndex]?.tasks?.[taskIndex]?.description
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                              }`}
                          />
                          {errors.groups?.[groupIndex]?.tasks?.[taskIndex]?.description && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.groups[groupIndex].tasks[taskIndex].description?.message}
                            </p>
                          )}
                        </div>
                        <div className="mb-2">
                          <label className="block text-gray-700">Quantity</label>
                          <input
                            type="number"
                            {...register(`groups.${groupIndex}.tasks.${taskIndex}.quantity` as const)}
                            className={`w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 ${errors.groups?.[groupIndex]?.tasks?.[taskIndex]?.quantity
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                              }`}
                          />
                          {errors.groups?.[groupIndex]?.tasks?.[taskIndex]?.quantity && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.groups[groupIndex].tasks[taskIndex].quantity?.message}
                            </p>
                          )}
                        </div>
                        <div className="mb-2">
                          <label className="block text-gray-700">Rate</label>
                          <input
                            type="number"
                            step="0.01"
                            {...register(`groups.${groupIndex}.tasks.${taskIndex}.rate` as const)}
                            className={`w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 ${errors.groups?.[groupIndex]?.tasks?.[taskIndex]?.rate
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                              }`}
                          />
                          {errors.groups?.[groupIndex]?.tasks?.[taskIndex]?.rate && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.groups[groupIndex].tasks[taskIndex].rate?.message}
                            </p>
                          )}
                        </div>

                        {/* Materials Section */}
                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-lg font-semibold text-gray-700">Materials</h4>
                            <button
                              type="button"
                              onClick={() => {
                                let _groups = [...groups];

                                for (let row of _groups) {

                                  let _task = row.tasks.filter((_data) => _data.id == task.id);
                                  _task[0].materials.push({
                                    id: _task[0].materials[_task[0].materials.length - 1].id + 1,
                                    name: "",
                                    quantity: 0,
                                    rate: 0,
                                    total: 0
                                  });
                                }
                                setGroups([..._groups]);
                              }
                              }
                              className="flex items-center bg-blue-500 text-white py-1 mb-2 px-3 rounded-md hover:bg-blue-600"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Add Material
                            </button>
                          </div>
                          {task.materials.map((material, materialIndex) => (
                            <div key={material.name + task.name + taskIndex + materialIndex + groupIndex} className="mb-4 p-4 border rounded-md bg-white">
                              <div className="mb-2">
                                <label className="block text-gray-700">Material Name</label>
                                <input
                                  type="text"
                                  {...register(`groups.${groupIndex}.tasks.${taskIndex}.materials.${materialIndex}.name` as const)}
                                  className={`w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 ${errors.groups?.[groupIndex]?.tasks?.[taskIndex]?.materials?.[materialIndex]?.name
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-blue-500"
                                    }`}
                                />
                                {errors.groups?.[groupIndex]?.tasks?.[taskIndex]?.materials?.[materialIndex]?.name && (
                                  <p className="text-red-500 text-sm mt-1">
                                    {errors.groups[groupIndex].tasks[taskIndex].materials[materialIndex].name?.message}
                                  </p>
                                )}
                              </div>
                              <div className="mb-2">
                                <label className="block text-gray-700">Quantity</label>
                                <input
                                  type="number"
                                  {...register(`groups.${groupIndex}.tasks.${taskIndex}.materials.${materialIndex}.quantity` as const)}
                                  className={`w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 ${errors.groups?.[groupIndex]?.tasks?.[taskIndex]?.materials?.[materialIndex]?.quantity
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-blue-500"
                                    }`}
                                />
                                {errors.groups?.[groupIndex]?.tasks?.[taskIndex]?.materials?.[materialIndex]?.quantity && (
                                  <p className="text-red-500 text-sm mt-1">
                                    {errors.groups[groupIndex].tasks[taskIndex].materials[materialIndex].quantity?.message}
                                  </p>
                                )}
                              </div>
                              <div className="mb-2">
                                <label className="block text-gray-700">Rate</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  {...register(`groups.${groupIndex}.tasks.${taskIndex}.materials.${materialIndex}.rate` as const)}
                                  className={`w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 ${errors.groups?.[groupIndex]?.tasks?.[taskIndex]?.materials?.[materialIndex]?.rate
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-blue-500"
                                    }`}
                                />
                                {errors.groups?.[groupIndex]?.tasks?.[taskIndex]?.materials?.[materialIndex]?.rate && (
                                  <p className="text-red-500 text-sm mt-1">
                                    {errors.groups[groupIndex].tasks[taskIndex].materials[materialIndex].rate?.message}
                                  </p>
                                )}
                              </div>
                              {task.materials.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    let _groups = [...groups];

                                    for (let row of _groups) {
                                      let _task = row.tasks.filter((_data) => _data.id == task.id);
                                      _task[0].materials = _task[0].materials.filter((_data) => _data.id != material.id);
                                    }
                                    setGroups([..._groups]);
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  Remove Material
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                < div className="mb-6" >
                  <label className="block text-gray-700">Discount</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register(`groups.${groupIndex}.discount` as const)}
                    className={`w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 ${errors.groups?.[groupIndex]?.discount
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                      }`}
                  />
                  {errors.groups?.[groupIndex]?.discount && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.groups[groupIndex].discount?.message}
                    </p>
                  )}
                </div>
              </div>
            </>
          ))}



          {/* Submit Button */}
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
          >
            Submit
          </button>
        </form>
      </div >
    </div >
  );
};

export default Home;
