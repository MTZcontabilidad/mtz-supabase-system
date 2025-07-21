import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  X,
  File,
  FileText,
  Image,
  FileVideo,
  Music,
  Archive,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import Button from '../ui/Button.jsx';
import { supabase } from '../../lib/supabase.js';

const FileUpload = ({
  onUpload,
  accept = 'image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  className = '',
  disabled = false,
  bucketName = 'mtz-documents', // Bucket de Supabase Storage
  folder = 'uploads', // Carpeta dentro del bucket
}) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  // Obtener icono según tipo de archivo
  const getFileIcon = file => {
    const type = file.type;
    if (type.startsWith('image/'))
      return <Image className='w-6 h-6 text-blue-500' />;
    if (type === 'application/pdf')
      return <FileText className='w-6 h-6 text-red-500' />;
    if (type.includes('word') || type.includes('document'))
      return <FileText className='w-6 h-6 text-blue-600' />;
    if (type.includes('excel') || type.includes('spreadsheet'))
      return <FileText className='w-6 h-6 text-green-600' />;
    if (type.startsWith('video/'))
      return <FileVideo className='w-6 h-6 text-purple-500' />;
    if (type.startsWith('audio/'))
      return <Music className='w-6 h-6 text-yellow-500' />;
    if (type.includes('zip') || type.includes('rar') || type.includes('tar'))
      return <Archive className='w-6 h-6 text-gray-500' />;
    return <File className='w-6 h-6 text-gray-400' />;
  };

  // Formatear tamaño de archivo
  const formatFileSize = bytes => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Obtener estado de carga
  const getUploadStatus = fileId => {
    const progress = uploadProgress[fileId];
    if (!progress) return null;
    if (progress.status === 'uploading') return 'uploading';
    if (progress.status === 'success') return 'success';
    if (progress.status === 'error') return 'error';
    return null;
  };

  // Generar nombre único para el archivo
  const generateUniqueFileName = originalName => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    const nameWithoutExtension = originalName.replace(`.${extension}`, '');
    return `${nameWithoutExtension}_${timestamp}_${randomString}.${extension}`;
  };

  // Cargar archivo a Supabase Storage
  const uploadFile = async file => {
    return new Promise((resolve, reject) => {
      const fileId = file.name + file.size;
      const uniqueFileName = generateUniqueFileName(file.name);
      const filePath = `${folder}/${uniqueFileName}`;

      // Iniciar progreso
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: { status: 'uploading', progress: 0 },
      }));

      // Subir archivo a Supabase Storage
      supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })
        .then(({ data, error }) => {
          if (error) {
            console.error('Error subiendo archivo:', error);
            setUploadProgress(prev => ({
              ...prev,
              [fileId]: {
                status: 'error',
                progress: 100,
                error: error.message,
              },
            }));
            reject(new Error(error.message));
            return;
          }

          // Obtener URL pública del archivo
          const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

          setUploadProgress(prev => ({
            ...prev,
            [fileId]: {
              status: 'success',
              progress: 100,
              url: urlData.publicUrl,
            },
          }));

          resolve({
            name: file.name,
            size: file.size,
            type: file.type,
            url: urlData.publicUrl,
            path: filePath,
            uploadedAt: new Date().toISOString(),
          });
        })
        .catch(error => {
          console.error('Error inesperado:', error);
          setUploadProgress(prev => ({
            ...prev,
            [fileId]: {
              status: 'error',
              progress: 100,
              error: 'Error inesperado al subir archivo',
            },
          }));
          reject(error);
        });
    });
  };

  // Manejar archivos seleccionados
  const onDrop = useCallback(
    async (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        console.log('Archivos rechazados:', rejectedFiles);
        alert(
          `Algunos archivos fueron rechazados. Verifica el tamaño y tipo de archivo.`
        );
        return;
      }

      const newFiles = acceptedFiles.map(file => ({
        ...file,
        id: file.name + file.size,
        preview: file.type.startsWith('image/')
          ? URL.createObjectURL(file)
          : null,
      }));

      setFiles(prev => [...prev, ...newFiles]);

      // Cargar archivos
      setUploading(true);
      const uploadPromises = newFiles.map(async file => {
        try {
          const result = await uploadFile(file);
          return { ...file, ...result };
        } catch (error) {
          console.error('Error subiendo archivo:', error);
          return { ...file, error: error.message };
        }
      });

      try {
        const results = await Promise.all(uploadPromises);
        const successfulUploads = results.filter(r => !r.error);

        if (successfulUploads.length > 0 && onUpload) {
          onUpload(successfulUploads);
        }

        // Mostrar resumen
        if (successfulUploads.length > 0) {
          console.log(
            `✅ ${successfulUploads.length} archivos subidos exitosamente`
          );
        }
        if (results.length > successfulUploads.length) {
          console.warn(
            `⚠️ ${results.length - successfulUploads.length} archivos fallaron`
          );
        }
      } catch (error) {
        console.error('Error en carga masiva:', error);
      } finally {
        setUploading(false);
      }
    },
    [onUpload, bucketName, folder]
  );

  // Configuración de dropzone
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: accept
        ? accept.split(',').reduce((acc, type) => {
            const [category, subtype] = type.trim().split('/');
            acc[category] = acc[category] || [];
            acc[category].push(subtype);
            return acc;
          }, {})
        : undefined,
      maxFiles,
      maxSize,
      disabled,
    });

  // Remover archivo
  const removeFile = async fileId => {
    const file = files.find(f => f.id === fileId);

    // Si el archivo fue subido exitosamente, eliminarlo de Storage
    if (file && file.path) {
      try {
        const { error } = await supabase.storage
          .from(bucketName)
          .remove([file.path]);

        if (error) {
          console.error('Error eliminando archivo de Storage:', error);
        }
      } catch (error) {
        console.error('Error eliminando archivo:', error);
      }
    }

    setFiles(prev => prev.filter(f => f.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  // Limpiar todos los archivos
  const clearAllFiles = async () => {
    // Eliminar archivos subidos de Storage
    const uploadedFiles = files.filter(f => f.path);
    if (uploadedFiles.length > 0) {
      try {
        const paths = uploadedFiles.map(f => f.path);
        const { error } = await supabase.storage.from(bucketName).remove(paths);

        if (error) {
          console.error('Error eliminando archivos de Storage:', error);
        }
      } catch (error) {
        console.error('Error eliminando archivos:', error);
      }
    }

    setFiles([]);
    setUploadProgress({});
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Área de drop */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragActive && !isDragReject ? 'border-blue-500 bg-blue-50' : ''}
          ${isDragReject ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <input {...getInputProps()} />

        <Upload
          className={`mx-auto h-12 w-12 mb-4 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`}
        />

        {isDragActive ? (
          <p className='text-lg font-medium text-blue-600'>
            Suelta los archivos aquí...
          </p>
        ) : (
          <div>
            <p className='text-lg font-medium text-gray-900 mb-2'>
              Arrastra archivos aquí o haz clic para seleccionar
            </p>
            <p className='text-sm text-gray-500'>
              Máximo {maxFiles} archivos, {formatFileSize(maxSize)} por archivo
            </p>
            <p className='text-xs text-gray-400 mt-1'>
              PDF, Word, Excel, imágenes y más
            </p>
          </div>
        )}
      </div>

      {/* Lista de archivos */}
      {files.length > 0 && (
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <h3 className='text-sm font-medium text-gray-900'>
              Archivos ({files.length})
            </h3>
            <Button
              variant='ghost'
              size='sm'
              onClick={clearAllFiles}
              className='text-red-600 hover:text-red-700'
            >
              Limpiar todo
            </Button>
          </div>

          <div className='space-y-2'>
            {files.map(file => {
              const status = getUploadStatus(file.id);
              const progress = uploadProgress[file.id]?.progress || 0;

              return (
                <div
                  key={file.id}
                  className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg border'
                >
                  {/* Icono del archivo */}
                  <div className='flex-shrink-0'>{getFileIcon(file)}</div>

                  {/* Información del archivo */}
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2'>
                      <p className='text-sm font-medium text-gray-900 truncate'>
                        {file.name}
                      </p>
                      {status === 'success' && (
                        <CheckCircle className='w-4 h-4 text-green-500' />
                      )}
                      {status === 'error' && (
                        <AlertCircle className='w-4 h-4 text-red-500' />
                      )}
                    </div>
                    <p className='text-xs text-gray-500'>
                      {formatFileSize(file.size)}
                    </p>

                    {/* Barra de progreso */}
                    {status === 'uploading' && (
                      <div className='mt-1'>
                        <div className='w-full bg-gray-200 rounded-full h-1'>
                          <div
                            className='bg-blue-600 h-1 rounded-full transition-all duration-300'
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className='text-xs text-gray-500 mt-1'>
                          Subiendo... {Math.round(progress)}%
                        </p>
                      </div>
                    )}

                    {/* Mensaje de error */}
                    {status === 'error' && (
                      <p className='text-xs text-red-500 mt-1'>
                        {uploadProgress[file.id]?.error ||
                          'Error al subir archivo'}
                      </p>
                    )}

                    {/* URL del archivo subido */}
                    {status === 'success' && file.url && (
                      <div className='mt-1'>
                        <a
                          href={file.url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-xs text-blue-600 hover:text-blue-800 underline'
                        >
                          Ver archivo
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Preview para imágenes */}
                  {file.preview && (
                    <div className='flex-shrink-0'>
                      <img
                        src={file.preview}
                        alt={file.name}
                        className='w-12 h-12 object-cover rounded border'
                      />
                    </div>
                  )}

                  {/* Botón eliminar */}
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => removeFile(file.id)}
                    className='text-gray-400 hover:text-red-600'
                    disabled={status === 'uploading'}
                  >
                    <X className='w-4 h-4' />
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Estado de carga general */}
          {uploading && (
            <div className='text-center py-2'>
              <div className='inline-flex items-center gap-2 text-sm text-blue-600'>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600'></div>
                Subiendo archivos a Supabase Storage...
              </div>
            </div>
          )}
        </div>
      )}

      {/* Información adicional */}
      <div className='text-xs text-gray-500 space-y-1'>
        <p>• Formatos soportados: PDF, Word, Excel, imágenes, videos, audio</p>
        <p>• Tamaño máximo por archivo: {formatFileSize(maxSize)}</p>
        <p>• Máximo {maxFiles} archivos por carga</p>
        <p>• Los archivos se almacenan en Supabase Storage de forma segura</p>
      </div>
    </div>
  );
};

export default FileUpload;
