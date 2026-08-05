function WorkspaceNavbar() {
  return (
    <div className="h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6">

      <h1 className="text-xl font-bold text-blue-500">
        CodeSync
      </h1>

      <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg">
        Leave
      </button>

    </div>
  );
}

export default WorkspaceNavbar;