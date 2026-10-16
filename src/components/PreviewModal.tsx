import './PreviewModal.css';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  title?: string;
}

const PreviewModal = ({ isOpen, onClose, fileUrl, title = "Document Preview" }: PreviewModalProps) => {
  if (!isOpen) return null;

  // Automatically detect if the Supabase URL is an image or a PDF
  const isImage = /\.(jpg|jpeg|png|gif|webp)/i.test(fileUrl);

  return (
    <div className="preview-modal-overlay" onClick={onClose}>
      <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="preview-modal-header">
          <h3 className="preview-modal-title">{title}</h3>
          <div className="preview-modal-actions">
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="preview-download-btn">
              Open Original
            </a>
            <button className="preview-close-btn" onClick={onClose}>&times;</button>
          </div>
        </div>
        
        <div className="preview-modal-body">
          {isImage ? (
            /* Renders the Photo */
            <img src={fileUrl} alt={title} className="preview-image" />
          ) : (
            /* Renders the PDF */
            <iframe 
              src={`${fileUrl}#toolbar=0&navpanes=0`} 
              title={title}
              className="preview-iframe"
            />
          )}
        </div>

      </div>
    </div>
  );
};

export default PreviewModal;