import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./stores/redaxStore";
import { addUser, deleteUser, updateUser } from "@/slice/todoSlice";
import { useState } from "react";
import { zustandStore } from "@/stores/zustand";
import { useAtom } from "jotai";
import { usersAtom, addUserAtom, deleteUserAtom, updateUserAtom } from "@/Atoms/atom";
import { Button } from "@/components/button";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

export default function App() {
  const reduxUsers = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const zustandUsers = zustandStore((state) => state.users);
  const zustandAdd = zustandStore((state) => state.addUser);
  const zustandDelete = zustandStore((state) => state.deleteUser);
  const zustandUpdate = zustandStore((state) => state.updateUser);

  const [jotaiUsers] = useAtom(usersAtom);
  const [, jotaiAdd] = useAtom(addUserAtom);
  const [, jotaiDelete] = useAtom(deleteUserAtom);
  const [, jotaiUpdate] = useAtom(updateUserAtom);

  const [open, setOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [surName, setSurName] = useState("");
  const [age, setAge] = useState("");
  const [job, setJob] = useState("");
  const [status, setStatus] = useState(false);
  const [adres, setAdres] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const handleSave = () => {
    if (editingUserId !== null) {
      dispatch(updateUser({ id: editingUserId, age: Number(age) || 25, job: job || "Developer" }));
      zustandUpdate({ id: editingUserId, name: name || "Anonymous", surName: surName || "User" });
      jotaiUpdate({ id: editingUserId, status, adres: adres || "Unknown" });
    } else {
      const id = Date.now();
      dispatch(addUser({ id, age: Number(age) || 25, job: job || "Developer" }));
      zustandAdd({ id, name: name || "Anonymous", surName: surName || "User" });
      jotaiAdd({ id, status, adres: adres || "Unknown" });
    }
    setName("");
    setSurName("");
    setAge("");
    setJob("");
    setStatus(false);
    setAdres("");
    setEditingUserId(null);
    setOpen(false);
  };

  const handleDelete = (id: number) => {
    dispatch(deleteUser(id));
    zustandDelete(id);
    jotaiDelete(id);
  };

  const handleStartEdit = (user: { id: number, name: string, surName: string, age: number, job: string, status: boolean, adres: string }) => {
    setName(user.name);
    setSurName(user.surName);
    setAge(user.age.toString());
    setJob(user.job);
    setStatus(user.status);
    setAdres(user.adres);
    setEditingUserId(user.id);
    setOpen(true);
  };

  const activeUsersList = reduxUsers.map((reduxUser) => {
    const zustandUser = zustandUsers.find((u) => u.id === reduxUser.id) || { name: "Anonymous", surName: "User" };
    const jotaiUser = jotaiUsers.find((u) => u.id === reduxUser.id) || { status: false, adres: "Unknown" };

    return {
      id: reduxUser.id,
      name: zustandUser.name,
      surName: zustandUser.surName,
      age: reduxUser.age,
      job: reduxUser.job,
      status: jotaiUser.status,
      adres: jotaiUser.adres,
    };
  });

  const filteredUsers = activeUsersList.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.surName.toLowerCase().includes(query) ||
      user.job.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen text-slate-100 font-sans antialiased p-6 flex flex-col items-center">
      <header className="w-full max-w-5xl border border-slate-900 rounded-3xl shadow-2xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:max-w-md flex items-center">
            <Search className="absolute left-4 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-slate-700 border border-slate-800 pl-12 pr-4 py-2.5 outline-none text-slate-200 transition focus:border-indigo-500 text-sm"
            />
          </div>

          <Button
            onClick={() => {
              setEditingUserId(null);
              setName("");
              setSurName("");
              setAge("");
              setJob("");
              setStatus(false);
              setAdres("");
              setOpen(true);
            }}
            size="lg"
            className="w-full bg-slate-600 hover:bg-slate-700 text-white sm:w-auto"
          >
            <Plus className="size-5" data-icon="inline-start" />
            Add User
          </Button>
        </div>

        <div>
          {filteredUsers.length === 0 && (
            <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-3xl">
              <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-slate-500 font-medium">
                {activeUsersList.length === 0
                  ? "No users found. Click 'Add User' to populate data."
                  : "No matches found for your search."}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-slate-700 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-6 shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-100 mt-2">{user.name} {user.surName}</h3>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${user.status
                        ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/20"
                        : "bg-amber-950/40 text-amber-400 border-amber-500/20"
                      }`}>
                      {user.status ? "Active" : "Inactive"}
                    </span>
                  </div>


                  <div className="mt-4 space-y-2 border-t border-slate-800/80 pt-3 text-sm">
                    <div className="flex justify-between text-slate-400">
                      <span>Profession:</span>
                      <span className="font-semibold text-slate-200">{user.job}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Age:</span>
                      <span className="font-semibold text-slate-200">{user.age} years</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => handleStartEdit(user)}
                    className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white hover:text-white py-2.5"
                  >
                    <Pencil className="size-3.5" data-icon="inline-start" />
                    EditUser
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(user.id)}
                    className="flex-1 bg-red-500 hover:bg-red-500 text-white py-2.5"
                  >
                    <Trash2 className="size-3.5" data-icon="inline-start" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <dialog
        open={open}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[440px] h-[98vh] rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl backdrop:bg-black/85 backdrop:backdrop-blur-sm"
      >
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="text-2xl font-black text-slate-100">
              {editingUserId !== null ? "Edit User Profile" : "Add New User"}
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              {editingUserId !== null
                ? "Modify this user's profile across all storage models."
                : "Register a new profile in all storage models."}
            </p>
          </div>

          <div className="flex flex-col gap-4 my-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">First Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter First Name"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none text-slate-200 transition focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Surname</label>
              <input
                type="text"
                value={surName}
                onChange={(e) => setSurName(e.target.value)}
                placeholder="Enter Surname"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none text-slate-200 transition focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter Age"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none text-slate-200 transition focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Job Title</label>
              <input
                type="text"
                value={job}
                onChange={(e) => setJob(e.target.value)}
                placeholder="Enter Job"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none text-slate-200 transition focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Address</label>
              <input
                type="text"
                value={adres}
                onChange={(e) => setAdres(e.target.value)}
                placeholder="Enter Address"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 outline-none text-slate-200 transition focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-3 mt-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <input
                type="checkbox"
                id="user-status"
                checked={status}
                onChange={(e) => setStatus(e.target.checked)}
                className="w-5 h-5 rounded-md accent-indigo-600 bg-slate-900 border-slate-800 focus:ring-indigo-500"
              />
              <label htmlFor="user-status" className="text-sm font-semibold text-slate-300 cursor-pointer">
                Set status to Active
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              variant="ghost"
              onClick={() => {
                setOpen(false);
                setName("");
                setSurName("");
                setAge("");
                setJob("");
                setStatus(false);
                setAdres("");
                setEditingUserId(null);
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl text-white bg-indigo-600 hover:bg-indigo-500"
            >
              {editingUserId !== null ? "Save Changes" : "Confirm"}
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  );
}