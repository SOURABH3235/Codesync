import { FaTimes } from "react-icons/fa";

function EditorTabs({
    openTabs,
    activeTab,
    setActiveTab,
    closeTab
}) {

    return (

        <div className="flex bg-slate-900 border-b border-slate-800">

            {openTabs.map(tab => (

                <div
                    key={tab.id}
                    className={`flex items-center gap-3 px-4 py-2 cursor-pointer
                    ${
                        activeTab === tab.id
                        ? "bg-slate-800 text-white"
                        : "text-gray-400"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                >

                    {tab.fileName}

                    <FaTimes
                        size={12}
                        onClick={(e) => {
                            e.stopPropagation();
                            closeTab(tab.id);
                        }}
                    />

                </div>

            ))}

        </div>

    );

}

export default EditorTabs;