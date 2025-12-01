import { Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';

export function BackgroundUploader() {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      localStorage.setItem('backgroundImage', base64);
      window.location.reload(); // Recarga para aplicar fondo
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBackground = () => {
    localStorage.removeItem('backgroundImage');
    window.location.reload();
  };

  const hasBackground = localStorage.getItem('backgroundImage');

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="gap-2"
        data-testid="button-background-settings"
      >
        <Upload className="h-4 w-4" />
        Fondo
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 p-4 bg-card border border-cyan-500/30 rounded-lg shadow-lg z-50 min-w-max">
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              data-testid="input-background-file"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="default"
              size="sm"
              className="w-full gap-2"
              data-testid="button-upload-background"
            >
              <Upload className="h-4 w-4" />
              Subir Imagen
            </Button>

            {hasBackground && (
              <Button
                onClick={handleRemoveBackground}
                variant="destructive"
                size="sm"
                className="w-full gap-2"
                data-testid="button-remove-background"
              >
                <Trash2 className="h-4 w-4" />
                Quitar Fondo
              </Button>
            )}

            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              className="w-full"
              data-testid="button-close-background"
            >
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
