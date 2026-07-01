import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getSeoDrafts } from "@/lib/admin/queries.functions";
import { updateSeoStatus, updateSeoContent, auditAllSeoContent } from "@/lib/admin/mutations.functions";
import { toast } from "sonner";
import {
  FileEdit,
  CheckCircle,
  XCircle,
  Send,
  Archive,
  RefreshCw,
  Search,
  Eye,
  Edit3
} from "lucide-react";

export function DraftReviewQueue() {
  const qc = useQueryClient();
  const fetchDrafts = useServerFn(getSeoDrafts);
  const updateStatus = useServerFn(updateSeoStatus);
  const updateContent = useServerFn(updateSeoContent);
  const auditAllContent = useServerFn(auditAllSeoContent);

  const [activeTab, setActiveTab] = useState<"draft" | "in_review" | "approved" | "published" | "archived" | "rejected">("draft");
  const [selectedDraft, setSelectedDraft] = useState<any | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState<any>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<{ totalAudited: number; demotedRecords: any[] } | null>(null);

  const { data: drafts = [], isLoading } = useQuery({
    queryKey: ["admin", "seo-drafts"],
    queryFn: () => fetchDrafts(),
  });

  const filteredDrafts = drafts.filter((d: any) => d.status === activeTab);

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: any }) => {
      setVerificationError(null);
      await updateStatus({ data: { id, status } });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "seo-drafts"] });
      setSelectedDraft(null);
      toast.success("Status updated");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update status");
      if (err.message?.includes("Verification Failed")) {
        setVerificationError(err.message);
      }
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      await updateContent({ data });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "seo-drafts"] });
      setEditMode(false);
      toast.success("Content saved");
    },
    onError: (err: any) => toast.error(err.message)
  });

  const auditMutation = useMutation({
    mutationFn: async () => {
      return await auditAllContent();
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["admin", "seo-drafts"] });
      setAuditResult({ totalAudited: res.totalAudited, demotedRecords: res.demotedRecords });
      toast.success("Global Audit Complete");
    },
    onError: (err: any) => toast.error(err.message)
  });

  const handleOpenDraft = (draft: any) => {
    setSelectedDraft(draft);
    setEditedData({
      id: draft.id,
      title: draft.title,
      slug: draft.slug,
      meta_title: draft.meta_title,
      meta_description: draft.meta_description,
      content: draft.content
    });
    setEditMode(false);
    setVerificationError(null);
  };

  const statusColors: any = {
    draft: "bg-gray-100 text-gray-800",
    in_review: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
    published: "bg-emerald-100 text-emerald-800 border border-emerald-300",
    rejected: "bg-red-100 text-red-800",
    archived: "bg-slate-100 text-slate-800"
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <h2 className="text-xl font-bold font-display text-forest flex items-center gap-2">
          <FileEdit className="w-5 h-5" /> Draft Review Queue
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => auditMutation.mutate()}
            disabled={auditMutation.isPending}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${auditMutation.isPending ? "animate-spin" : ""}`} />
            Run Global Audit
          </button>
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit overflow-x-auto">
          {["draft", "in_review", "approved", "published", "rejected", "archived"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize whitespace-nowrap ${
                activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.replace("_", " ")} ({drafts.filter((d: any) => d.status === tab).length})
            </button>
          ))}
        </div>
        </div>
      </div>

      {auditResult && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Global Audit Complete</h3>
          <p className="text-sm text-gray-600 mb-4">
            Scanned {auditResult.totalAudited} records. Found {auditResult.demotedRecords.length} violations.
          </p>
          {auditResult.demotedRecords.length > 0 && (
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {auditResult.demotedRecords.map((r, i) => (
                <li key={i} className="flex flex-col text-sm p-3 bg-red-50 border border-red-100 rounded-lg">
                  <span className="font-semibold text-red-900">{r.title}</span>
                  <span className="text-red-700 text-xs">Demoted from <strong className="uppercase">{r.previousStatus}</strong> to <strong>IN REVIEW</strong></span>
                  <span className="text-red-600 text-xs mt-1 font-mono">{r.reasons}</span>
                </li>
              ))}
            </ul>
          )}
          <button onClick={() => setAuditResult(null)} className="mt-4 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium">Dismiss</button>
        </div>
      )}

      {/* Main Layout: List (Left) + Detail (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* List */}
        <div className="lg:col-span-1 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-gray-50 bg-gray-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search keyword or title..." 
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {isLoading ? (
              <p className="p-4 text-sm text-gray-500 text-center">Loading drafts...</p>
            ) : filteredDrafts.length === 0 ? (
              <p className="p-4 text-sm text-gray-500 text-center">No pages in this status.</p>
            ) : (
              filteredDrafts.map((draft: any) => (
                <button
                  key={draft.id}
                  onClick={() => handleOpenDraft(draft)}
                  className={`w-full text-left p-4 rounded-xl transition-all border ${
                    selectedDraft?.id === draft.id 
                      ? "bg-emerald-50 border-emerald-100" 
                      : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">{draft.type}</span>
                    <span className="text-[10px] text-gray-400">{new Date(draft.updated_at).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 truncate">{draft.target_keyword}</h4>
                  <p className="text-xs text-gray-500 truncate mt-1">{draft.title}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm h-[600px] flex flex-col">
          {selectedDraft ? (
            <>
              {/* Toolbar */}
              <div className="p-4 border-b border-gray-100 flex flex-wrap gap-2 items-center justify-between bg-gray-50/50 rounded-t-2xl">
                <div className="flex flex-col gap-2 w-full">
                  {verificationError && (
                    <div className="w-full mb-2 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm flex items-start gap-2">
                      <XCircle className="w-5 h-5 shrink-0 text-red-500" />
                      <div>
                        <strong className="block font-semibold">Publish Blocked</strong>
                        {verificationError}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${statusColors[selectedDraft.status]}`}>
                    {selectedDraft.status.replace("_", " ")}
                  </span>
                  <span className="text-xs text-gray-500">
                    Target: <strong className="text-gray-900">{selectedDraft.target_keyword}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Status Actions based on current status */}
                  {selectedDraft.status === 'draft' && (
                    <>
                      <button onClick={() => statusMutation.mutate({ id: selectedDraft.id, status: 'rejected' })} className="p-2 text-red-600 hover:bg-red-50 rounded-lg tooltip" title="Reject"><XCircle className="w-4 h-4" /></button>
                      <button onClick={() => statusMutation.mutate({ id: selectedDraft.id, status: 'in_review' })} className="px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg flex items-center gap-1"><Eye className="w-3 h-3"/> Request Review</button>
                    </>
                  )}
                  {selectedDraft.status === 'in_review' && (
                    <>
                      <button onClick={() => statusMutation.mutate({ id: selectedDraft.id, status: 'rejected' })} className="p-2 text-red-600 hover:bg-red-50 rounded-lg tooltip" title="Reject"><XCircle className="w-4 h-4" /></button>
                      <button onClick={() => statusMutation.mutate({ id: selectedDraft.id, status: 'approved' })} className="px-3 py-1.5 text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-100 rounded-lg flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Approve</button>
                    </>
                  )}
                  {selectedDraft.status === 'approved' && (
                    <>
                      <button onClick={() => statusMutation.mutate({ id: selectedDraft.id, status: 'draft' })} className="px-3 py-1.5 text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg flex items-center gap-1"><RefreshCw className="w-3 h-3"/> Revert</button>
                      <button onClick={() => statusMutation.mutate({ id: selectedDraft.id, status: 'published' })} className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 rounded-lg flex items-center gap-1"><Send className="w-3 h-3"/> Publish Live</button>
                    </>
                  )}
                  {(selectedDraft.status === 'published' || selectedDraft.status === 'rejected') && (
                    <button onClick={() => statusMutation.mutate({ id: selectedDraft.id, status: 'archived' })} className="px-3 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg flex items-center gap-1"><Archive className="w-3 h-3"/> Archive</button>
                  )}
                  
                  <div className="w-px h-4 bg-gray-300 mx-1"></div>
                  <button 
                    onClick={() => setEditMode(!editMode)} 
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors ${editMode ? 'bg-forest text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                  >
                    {editMode ? <Eye className="w-3 h-3"/> : <Edit3 className="w-3 h-3"/>}
                    {editMode ? "Preview" : "Edit"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Editor / Preview Area */}
              <div className="flex-1 overflow-y-auto p-6">
                {editMode ? (
                  <div className="space-y-4 max-w-2xl">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                      <input type="text" value={editedData.title} onChange={e => setEditedData({...editedData, title: e.target.value})} className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">URL Slug</label>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-400 bg-gray-50 border border-r-0 rounded-l-lg px-3 py-2">/</span>
                        <input type="text" value={editedData.slug} onChange={e => setEditedData({...editedData, slug: e.target.value})} className="w-full p-2 text-sm border rounded-r-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Meta Title</label>
                        <textarea value={editedData.meta_title} onChange={e => setEditedData({...editedData, meta_title: e.target.value})} className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" rows={2} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Meta Description</label>
                        <textarea value={editedData.meta_description} onChange={e => setEditedData({...editedData, meta_description: e.target.value})} className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" rows={2} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Markdown Content</label>
                      <textarea value={editedData.content} onChange={e => setEditedData({...editedData, content: e.target.value})} className="w-full p-3 font-mono text-xs border rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50" rows={15} />
                    </div>
                    <div className="pt-4 flex justify-end gap-2 border-t">
                      <button onClick={() => { setEditMode(false); setEditedData({...selectedDraft}); }} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                      <button onClick={() => saveMutation.mutate(editedData)} disabled={saveMutation.isPending} className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-500 rounded-lg">Save Changes</button>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-sm prose-emerald max-w-none">
                    <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                      <p className="text-xs text-gray-500"><strong>URL:</strong> /{selectedDraft.slug}</p>
                      <p className="text-xs text-gray-500"><strong>Meta Title:</strong> {selectedDraft.meta_title}</p>
                      <p className="text-xs text-gray-500"><strong>Meta Desc:</strong> {selectedDraft.meta_description}</p>
                    </div>
                    <h1 className="font-display">{selectedDraft.title}</h1>
                    <div className="whitespace-pre-wrap font-mono text-xs text-gray-700 bg-white border rounded-xl p-6 shadow-inner">
                      {selectedDraft.content}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400">
              <FileEdit className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm font-medium text-gray-500">Select a draft to review</p>
              <p className="text-xs mt-1">You can edit contents before publishing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
