'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UploadCloud, FileText } from 'lucide-react';

type FileUploadProps = {
  onGenerate: () => void;
};

export default function FileUpload({ onGenerate }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    onGenerate();
  };

  return (
    <div className="flex flex-col items-center justify-center text-center pt-10">
      <Card className="w-full max-w-lg shadow-lg animate-in fade-in-50 zoom-in-95 duration-500">
        <CardHeader>
          <div className="mx-auto bg-secondary p-3 rounded-full mb-4">
            <UploadCloud className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Upload Your Pitch Deck</CardTitle>
          <CardDescription>
            Upload a PDF or PPT file to generate a comprehensive startup analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center space-y-2">
            <Input
              id="file-upload"
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              accept=".pdf,.ppt,.pptx"
            />
            {file ? (
              <div className="flex items-center space-x-2 text-foreground">
                <FileText className="w-6 h-6" />
                <span>{file.name}</span>
              </div>
            ) : (
              <div className="text-muted-foreground">
                <p>Drag & drop your file here, or</p>
                <Button variant="link" className="text-primary p-0 h-auto" asChild>
                  <label htmlFor="file-upload">browse files</label>
                </Button>
              </div>
            )}
          </div>
          <Button size="lg" className="w-full font-bold" onClick={handleUploadClick} disabled={!file}>
            Generate Analysis
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
