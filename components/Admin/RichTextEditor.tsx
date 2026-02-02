import React, { useRef, useState, useEffect } from 'react';
import {
    Bold, Italic, Link as LinkIcon, Image as ImageIcon, List,
    Heading1, Heading2, Quote, AlignLeft, AlignCenter, AlignRight,
    Maximize, Minimize, Upload, Trash2, Link2, Type,
    Eraser, Underline as UnderlineIcon, Sparkles
} from 'lucide-react';
import { adminService } from '../../services/adminService';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, className, placeholder }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedImg, setSelectedImg] = useState<HTMLImageElement | null>(null);

    // Sync content from outside - Only if significantly different to avoid cursor jumps
    useEffect(() => {
        if (editorRef.current) {
            const currentHTML = editorRef.current.innerHTML;
            if (currentHTML !== value) {
                // Se o editor estiver vazio ou for uma mudança grande
                if (currentHTML === '' || currentHTML === '<br>' || Math.abs(currentHTML.length - value.length) > 50) {
                    editorRef.current.innerHTML = value;
                }
            }
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const execCmd = (command: string, value: any = null) => {
        editorRef.current?.focus();
        // Em alguns navegadores, formatBlock precisa de tags sem os colchetes
        const val = (command === 'formatBlock' && typeof value === 'string' && value.startsWith('<'))
            ? value.replace(/[<>]/g, '')
            : value;
        document.execCommand(command, false, val);
        handleInput();
    };

    const insertHtml = (html: string) => {
        editorRef.current?.focus();
        if (document.queryCommandSupported('insertHTML')) {
            document.execCommand('insertHTML', false, html);
        } else {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;
            const range = selection.getRangeAt(0);
            range.deleteContents();
            const div = document.createElement('div');
            div.innerHTML = html;
            const fragment = document.createDocumentFragment();
            let lastNode;
            while ((lastNode = div.firstChild)) fragment.appendChild(lastNode);
            range.insertNode(fragment);
        }
        handleInput();
    };

    const handleImageUpload = async (file: File) => {
        const url = await adminService.uploadImage(file);
        if (url) {
            insertHtml(`<img src="${url}" alt="Imagem" class="blog-image" style="max-width: 100%; border-radius: 12px; margin: 20px auto; display: block;" />`);
        }
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleImageUpload(file);
        e.target.value = '';
    };

    const handleLink = () => {
        const url = prompt('Digite a URL do link:');
        if (url) execCmd('createLink', url);
    };

    const handleImageUrl = () => {
        const url = prompt('Digite a URL da imagem:');
        if (url) {
            insertHtml(`<img src="${url}" alt="Imagem" class="blog-image" style="max-width: 100%; border-radius: 12px; margin: 20px auto; display: block;" />`);
        }
    };

    const alignImage = (align: 'left' | 'center' | 'right') => {
        if (!selectedImg) return;
        selectedImg.style.display = 'block';
        if (align === 'left') {
            selectedImg.style.marginLeft = '0';
            selectedImg.style.marginRight = 'auto';
        } else if (align === 'center') {
            selectedImg.style.marginLeft = 'auto';
            selectedImg.style.marginRight = 'auto';
        } else if (align === 'right') {
            selectedImg.style.marginLeft = 'auto';
            selectedImg.style.marginRight = '0';
        }
        handleInput();
    };

    const resizeImage = (factor: number) => {
        if (!selectedImg) return;
        const currentWidth = selectedImg.offsetWidth;
        selectedImg.style.width = `${currentWidth * factor}px`;
        handleInput();
    };

    const removeImage = () => {
        if (!selectedImg) return;
        selectedImg.remove();
        setSelectedImg(null);
        handleInput();
    };

    useEffect(() => {
        const editor = editorRef.current;
        if (!editor) return;

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'IMG') {
                setSelectedImg(target as HTMLImageElement);
            } else {
                setSelectedImg(null);
            }
        };

        editor.addEventListener('click', handleClick);
        return () => editor.removeEventListener('click', handleClick);
    }, []);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                if (files[i].type.startsWith('image/')) {
                    handleImageUpload(files[i]);
                }
            }
        }
    };

    const autoFormatContent = () => {
        if (!editorRef.current) return;

        // Get plain text content
        let content = editorRef.current.innerText || editorRef.current.textContent || '';

        if (!content.trim()) {
            alert('O editor está vazio. Adicione algum conteúdo primeiro.');
            return;
        }

        // Split into paragraphs
        const paragraphs = content.split('\n').filter(p => p.trim());

        let formattedHTML = '';

        paragraphs.forEach((para, index) => {
            const trimmed = para.trim();

            // Skip empty paragraphs
            if (!trimmed) return;

            // Detect if it's a title (short, no punctuation at end, or all caps)
            const isTitle = (
                trimmed.length < 80 &&
                !trimmed.endsWith('.') &&
                !trimmed.endsWith('!') &&
                !trimmed.endsWith('?')
            ) || trimmed === trimmed.toUpperCase();

            // Detect list items (starts with -, *, •, or number.)
            const isListItem = /^[-*•]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed);

            if (index === 0 && trimmed.length < 100) {
                // First paragraph is likely the main title
                formattedHTML += `<h1 style="font-size: 2.5rem; font-weight: 800; color: #1e293b; margin-bottom: 1.5rem; line-height: 1.2;">${trimmed}</h1>`;
            } else if (isTitle) {
                // Secondary titles
                formattedHTML += `<h2 style="font-size: 1.875rem; font-weight: 700; color: #334155; margin-top: 2.5rem; margin-bottom: 1rem; line-height: 1.3;">${trimmed}</h2>`;
            } else if (isListItem) {
                // List items
                const cleanText = trimmed.replace(/^[-*•]\s/, '').replace(/^\d+\.\s/, '');
                formattedHTML += `<li style="margin-bottom: 0.75rem; line-height: 1.8; color: #475569;">${cleanText}</li>`;
            } else {
                // Regular paragraphs
                formattedHTML += `<p style="font-size: 1.125rem; line-height: 1.8; color: #475569; margin-bottom: 1.5rem; text-align: justify;">${trimmed}</p>`;
            }
        });

        // Wrap list items in ul
        formattedHTML = formattedHTML.replace(/(<li[^>]*>.*?<\/li>)+/g, (match) => {
            return `<ul style="margin: 1.5rem 0; padding-left: 2rem; list-style-type: disc;">${match}</ul>`;
        });

        // Update editor
        editorRef.current.innerHTML = formattedHTML;
        onChange(formattedHTML);

        alert('✨ Conteúdo formatado com sucesso! Estilos profissionais aplicados.');
    };

    return (
        <div className={`editor-container border border-gray-200 rounded-3xl overflow-hidden bg-white shadow-xl flex flex-col ${className}`} style={{ height: '700px' }}>
            {/* Toolbar Principal - FIXA */}
            <div className="toolbar p-3 bg-white border-b border-gray-100 sticky top-0 z-30 flex flex-wrap items-center gap-1 shadow-sm">

                <select
                    onChange={(e) => execCmd('fontName', e.target.value)}
                    className="text-[11px] font-bold bg-gray-50 border-none rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
                >
                    <option value="Inter, sans-serif">Inter (Padrão)</option>
                    <option value="Georgia, serif">Georgia (Serif)</option>
                    <option value="monospace">Monospace</option>
                    <option value="Poppins, sans-serif">Poppins</option>
                    <option value="Arial, sans-serif">Arial</option>
                </select>

                <select
                    onChange={(e) => execCmd('fontSize', e.target.value)}
                    className="text-[11px] font-bold bg-gray-50 border-none rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer ml-1"
                >
                    <option value="1">Muito Pequeno</option>
                    <option value="2">Pequeno</option>
                    <option value="3" selected>Normal</option>
                    <option value="4">Médio</option>
                    <option value="5">Grande</option>
                    <option value="6">Extra G</option>
                    <option value="7">Gigante</option>
                </select>

                <div className="w-px h-6 bg-gray-100 mx-2" />

                <div className="flex items-center gap-0.5">
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd('bold'); }} className="toolbar-btn" title="Negrito"><Bold size={18} /></button>
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd('italic'); }} className="toolbar-btn" title="Itálico"><Italic size={18} /></button>
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd('underline'); }} className="toolbar-btn" title="Sublinhado"><UnderlineIcon size={18} /></button>
                </div>

                <div className="w-px h-6 bg-gray-100 mx-2" />

                <div className="flex items-center gap-0.5">
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd('formatBlock', 'h1'); }} className="toolbar-btn" title="Título 1"><Heading1 size={18} /></button>
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd('formatBlock', 'h2'); }} className="toolbar-btn" title="Título 2"><Heading2 size={18} /></button>
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd('insertUnorderedList'); }} className="toolbar-btn" title="Lista"><List size={18} /></button>
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd('formatBlock', 'blockquote'); }} className="toolbar-btn" title="Citação"><Quote size={18} /></button>
                </div>

                <div className="w-px h-6 bg-gray-100 mx-2" />

                <div className="flex items-center gap-0.5">
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); handleLink(); }} className="toolbar-btn" title="Link"><Link2 size={18} /></button>
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); fileInputRef.current?.click(); }} className="toolbar-btn text-blue-600 bg-blue-50" title="Upload Imagem"><Upload size={18} /></button>
                    <button type="button" onMouseDown={(e) => { e.preventDefault(); handleImageUrl(); }} className="toolbar-btn" title="Imagem por URL"><ImageIcon size={18} /></button>
                </div>

                <div className="flex-1" />

                <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); autoFormatContent(); }}
                    className="toolbar-btn text-purple-600 bg-purple-50 font-bold"
                    title="Auto-Formatar Conteúdo"
                >
                    <Sparkles size={18} />
                </button>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd('removeFormat'); }} className="toolbar-btn text-red-400" title="Limpar">
                    <Eraser size={18} />
                </button>
            </div>

            {/* Sub-toolbar de Imagem */}
            {selectedImg && (
                <div className="bg-blue-600 text-white p-2 flex items-center justify-center gap-6 animate-in slide-in-from-top-2 duration-300">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Ajustar Imagem:</span>
                    <div className="flex gap-1">
                        <button onClick={() => alignImage('left')} className="p-1.5 hover:bg-white/20 rounded-lg"><AlignLeft size={16} /></button>
                        <button onClick={() => alignImage('center')} className="p-1.5 hover:bg-white/20 rounded-lg"><AlignCenter size={16} /></button>
                        <button onClick={() => alignImage('right')} className="p-1.5 hover:bg-white/20 rounded-lg"><AlignRight size={16} /></button>
                    </div>
                    <div className="h-4 w-px bg-white/20" />
                    <div className="flex gap-1">
                        <button onClick={() => resizeImage(1.1)} className="p-1.5 hover:bg-white/20 rounded-lg"><Maximize size={16} /></button>
                        <button onClick={() => resizeImage(0.9)} className="p-1.5 hover:bg-white/20 rounded-lg"><Minimize size={16} /></button>
                    </div>
                    <button onClick={removeImage} className="ml-4 bg-red-500 p-1.5 rounded-lg"><Trash2 size={16} /></button>
                </div>
            )}

            <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" accept="image/*" />

            {/* Área Editável - Scroll Independente */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="flex-1 p-12 outline-none font-sans text-lg leading-relaxed overflow-y-auto prose prose-blue max-w-none prose-img:cursor-pointer bg-white"
                style={{ scrollBehavior: 'smooth' }}
                placeholder={placeholder}
            />

            <div className="bg-gray-50 px-8 py-3 text-[10px] font-bold text-gray-400 border-t border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="uppercase tracking-widest">Editor Pró Ativo</span>
                </div>
                <div>{value.replace(/<[^>]*>/g, '').length} caracteres</div>
            </div>

            <style>{`
                .toolbar-btn {
                    padding: 10px;
                    color: #4b5563;
                    border-radius: 12px;
                    transition: all 0.2s;
                }
                .toolbar-btn:hover {
                    color: #2563eb;
                    background-color: #eff6ff;
                }
                [contenteditable]:empty:before {
                    content: attr(placeholder);
                    color: #9ca3af;
                    font-style: italic;
                    pointer-events: none;
                }
                .blog-image {
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .blog-image:hover {
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.4);
                }
            `}</style>
        </div>
    );
};

export default RichTextEditor;
