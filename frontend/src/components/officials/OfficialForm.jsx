import React from "react";

const OfficialForm = ({ formData, onChange, onFileChange, onSubmit }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter name"
          value={formData.name}
          onChange={onChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="position"
          className="block text-sm font-medium text-gray-700"
        >
          Position
        </label>
        <input
          type="text"
          id="position"
          name="position"
          placeholder="Enter position"
          value={formData.position}
          onChange={onChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-700"
        >
          Type
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={onChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        >
          <option value="">Select type</option>
          <option value="head">Head</option>
          <option value="vice">Vice</option>
          <option value="officer">Officer</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700"
        >
          Profile Image
        </label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={onFileChange}
          className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm file:bg-white file:border file:border-gray-300 file:rounded file:py-1 file:px-2 file:text-sm hover:file:bg-gray-50"
        />
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default OfficialForm;
