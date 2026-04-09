import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
    Bold,
    FileDown,
    Heading2,
    Heading3,
    Italic,
    List,
    ListOrdered,
    X,
} from "lucide-react";
import { useState } from "react";

interface ManualEditorProps {
    onClose: () => void;
}

const ManualEditor = ({ onClose }: ManualEditorProps) => {
    const [title, setTitle] = useState("");

    const editor = useEditor({
        extensions: [StarterKit],
        content: '<p>Commencez à rédiger votre manuel ici...</p>',
        editorProps: {
            attributes: {
                class: 'outline-none min-h-[250px] prose prose-sm max-w-none focus:outline-none',
            },
        },
    });

    const handleGeneratePDF = async () => {
        if (!editor) return;

        const editorHtml = editor.getHTML();
        const element = document.createElement('div');
        
        element.innerHTML = `
            <div style="font-family: 'Helvetica', 'Arial', sans-serif; padding: 40px; color: #1f2937; background: white;">
                <div style="border-bottom: 4px solid #fbbb01; padding-bottom: 15px; margin-bottom: 30px;">
                    <h1 style="font-size: 28px; font-weight: 800; margin: 0; color: #1f2937; text-transform: uppercase; letter-spacing: -0.5px;">
                        ${title || 'Manuel Utilisateur'}
                    </h1>
                    <p style="font-size: 10px; color: #9ca3af; margin-top: 5px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                        Document Interne - HENRI FRAISE & Cie
                    </p>
                </div>
                <div style="font-size: 14px; line-height: 1.8; color: #374151;">
                    ${editorHtml}
                </div>
                <div style="margin-top: 60px; pt-20px; border-top: 1px solid #f3f4f6; font-size: 9px; color: #d1d5db; text-align: center;">
                    Généré numériquement le ${new Date().toLocaleDateString('fr-FR')}
                </div>
            </div>
        `;

        try {
            const html2pdf = (await import('html2pdf.js')).default;
            
            const pdfOptions: any = {
                margin: [15, 15, 15, 15],
                filename: 'Manuel_utilisateur.pdf', 
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2, 
                    useCORS: true, 
                    letterRendering: true,
                    scrollX: 0,
                    scrollY: 0
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            await html2pdf().set(pdfOptions).from(element).save();
        } catch (error) {
            console.error("Erreur PDF:", error);
            alert("Erreur lors de la génération.");
        }
    };

    const tools = [
        { icon: <Bold size={16} />, label: 'Gras', action: () => editor?.chain().focus().toggleBold().run(), active: editor?.isActive('bold') },
        { icon: <Italic size={16} />, label: 'Italique', action: () => editor?.chain().focus().toggleItalic().run(), active: editor?.isActive('italic') },
        { icon: <Heading2 size={16} />, label: 'Titre 2', action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), active: editor?.isActive('heading', { level: 2 }) },
        { icon: <Heading3 size={16} />, label: 'Titre 3', action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), active: editor?.isActive('heading', { level: 3 }) },
        { icon: <List size={16} />, label: 'Liste à puces', action: () => editor?.chain().focus().toggleBulletList().run(), active: editor?.isActive('bulletList') },
        { icon: <ListOrdered size={16} />, label: 'Liste numérotée', action: () => editor?.chain().focus().toggleOrderedList().run(), active: editor?.isActive('orderedList') },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
            <div className="bg-white w-full sm:max-w-4xl rounded-t-xl sm:rounded-sm shadow-2xl flex flex-col h-[95dvh] sm:h-[90vh] border border-gray-300 overflow-hidden">

                {/* Header responsive */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-[#1f2937] border-b-4 border-[#fbbb01]">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#fbbb01] p-1.5 rounded-sm">
                            <FileDown size={18} className="text-[#1f2937]" />
                        </div>
                        <h2 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-white">
                            Editeur de manuel
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Zone Titre responsive */}
                <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 bg-gray-50/50">
                    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#fbbb01] mb-2 text-center sm:text-left">Titre du document</p>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: Procédure d'accès..."
                        className="w-full bg-white border-b-2 border-gray-200 focus:border-[#fbbb01] px-0 py-2 sm:py-3 text-base sm:text-lg font-bold outline-none transition-all placeholder:text-gray-300 text-center sm:text-left"
                    />
                </div>

                {/* Toolbar scrollable sur mobile */}
                <div className="flex items-center gap-1 px-4 sm:px-8 py-3 border-b border-gray-100 bg-white overflow-x-auto no-scrollbar">
                    {tools.map((btn, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={btn.action}
                            className={`p-2.5 rounded-sm shrink-0 transition-all ${
                                btn.active 
                                ? 'bg-[#fbbb01] text-[#1f2937] shadow-sm' 
                                : 'text-gray-400 hover:bg-gray-100'
                            }`}
                        >
                            {btn.icon}
                        </button>
                    ))}
                </div>

                {/* Editeur */}
                <div className="flex-1 overflow-y-auto bg-white px-6 sm:px-8 py-4 sm:py-6">
                    <div className="max-w-none min-h-full">
                        <EditorContent editor={editor} />
                    </div>
                </div>

                {/* Footer Action Responsive */}
                <div className="px-6 sm:px-8 py-5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center sm:text-left">
                        Déposer dans{' '}
                        <code className="bg-gray-200 px-1.5 py-0.5 rounded text-gray-600 font-mono lowercase">
                            public/docs/
                        </code>
                    </p>
                    
                    <div className="flex flex-row-reverse sm:flex-row gap-3 w-full sm:w-auto">
                        <button
                            onClick={onClose}
                            className="flex-1 sm:flex-none px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleGeneratePDF}
                            className="flex-[2] sm:flex-none flex items-center justify-center gap-3 bg-[#1f2937] text-[#fbbb01] px-6 py-2.5 rounded-sm text-[11px] font-black uppercase tracking-[0.15em] transition-all shadow-lg active:scale-95"
                        >
                            <FileDown size={16} />
                            <span>Exporter en PDF</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManualEditor;