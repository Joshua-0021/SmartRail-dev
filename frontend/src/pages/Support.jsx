import { useState, useEffect } from "react";

export default function Support() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    // revoke object URLs on unmount
    return () => previews.forEach((p) => URL.revokeObjectURL(p));
  }, [previews]);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);

    // create previews
    const p = selected.map((f) => URL.createObjectURL(f));
    // revoke old previews
    previews.forEach((u) => URL.revokeObjectURL(u));
    setPreviews(p);
  };

  const handleRemove = (idx) => {
    const newFiles = files.filter((_, i) => i !== idx);
    const newPreviews = previews.filter((_, i) => i !== idx);
    setFiles(newFiles);
    previews[idx] && URL.revokeObjectURL(previews[idx]);
    setPreviews(newPreviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now just log; backend hookup can be added later
    console.log("Submitting complaint", { description, files });
    alert("Complaint submitted (demo). Check console for payload.");
    setDescription("");
    setFiles([]);
    previews.forEach((u) => URL.revokeObjectURL(u));
    setPreviews([]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white border border-[#D4D4D4] rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-[#2B2B2B] mb-2">Support / File a Complaint</h2>
        <p className="text-sm text-[#2B2B2B] mb-6">Describe your issue and attach one or more images (optional).</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2B2B2B] mb-1">Upload images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full text-sm text-[#2B2B2B]"
            />
          </div>

          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {previews.map((src, idx) => (
                <div key={idx} className="relative border border-[#D4D4D4] rounded overflow-hidden">
                  <img src={src} alt={`preview-${idx}`} className="w-full h-32 object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="absolute top-1 right-1 bg-[#2B2B2B] text-white text-xs px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#2B2B2B] mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Describe the problem, where it happened, train/PNR if applicable..."
              className="w-full rounded border border-[#D4D4D4] p-3 text-sm text-[#2B2B2B]"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-[#2B2B2B] text-white rounded hover:opacity-95 transition"
            >
              Submit Complaint
            </button>

            <button
              type="button"
              onClick={() => { setDescription(""); setFiles([]); previews.forEach((u) => URL.revokeObjectURL(u)); setPreviews([]); }}
              className="px-4 py-2 border border-[#2B2B2B] text-[#2B2B2B] rounded"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
