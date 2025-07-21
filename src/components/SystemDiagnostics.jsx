import React, { useState, useEffect } from 'react';
import { runSystemDiagnostics, fixCommonIssues, quickTest } from '../lib/system-diagnostics.js';

const SystemDiagnostics = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fixes, setFixes] = useState([]);

  // Ejecutar diagnóstico automáticamente al cargar
  useEffect(() => {
    const runQuickTest = async () => {
      setLoading(true);
      try {
        const isWorking = await quickTest();
        if (!isWorking) {
          // Si el test rápido falla, ejecutar diagnóstico completo
          const diagnostics = await runSystemDiagnostics();
          setResults(diagnostics);
        }
      } catch (err) {
        console.error('Error en test rápido:', err);
      } finally {
        setLoading(false);
      }
    };

    runQuickTest();
  }, []);

  const handleRunDiagnostics = async () => {
    setLoading(true);
    try {
      const diagnostics = await runSystemDiagnostics();
      setResults(diagnostics);
    } catch (err) {
      console.error('Error ejecutando diagnósticos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFixes = async () => {
    setLoading(true);
    try {
      const appliedFixes = await fixCommonIssues();
      setFixes(appliedFixes);
      
      // Re-ejecutar diagnósticos después de aplicar fixes
      setTimeout(async () => {
        const newDiagnostics = await runSystemDiagnostics();
        setResults(newDiagnostics);
        setLoading(false);
      }, 2000);
    } catch (err) {
      console.error('Error aplicando correcciones:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Ejecutando diagnósticos del sistema...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!results && fixes.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">🔧 Diagnósticos del Sistema</h3>
        <p className="text-gray-600 mb-4">
          Ejecuta un diagnóstico completo para verificar el estado del sistema MTZ.
        </p>
        <button
          onClick={handleRunDiagnostics}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Ejecutar Diagnóstico
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen */}
      {results && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">📊 Resumen del Diagnóstico</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{results.summary.passed}</div>
              <div className="text-sm text-gray-600">Pruebas Exitosas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{results.summary.warnings}</div>
              <div className="text-sm text-gray-600">Advertencias</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{results.summary.failed}</div>
              <div className="text-sm text-gray-600">Pruebas Fallidas</div>
            </div>
          </div>
          
          {results.summary.failed > 0 && (
            <button
              onClick={handleApplyFixes}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Aplicar Correcciones Automáticas
            </button>
          )}
        </div>
      )}

      {/* Correcciones aplicadas */}
      {fixes.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">🔧 Correcciones Aplicadas</h3>
          <div className="space-y-2">
            {fixes.map((fix, index) => (
              <div 
                key={index} 
                className={`p-2 rounded ${
                  fix.startsWith('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}
              >
                {fix}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detalles de las pruebas */}
      {results && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">🔍 Detalles de las Pruebas</h3>
          <div className="space-y-4">
            {results.tests.map((test, index) => (
              <div key={index} className="border-l-4 border-l-gray-200 pl-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`text-sm font-medium ${
                    test.status === 'PASS' ? 'text-green-600' : 
                    test.status === 'WARNING' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {test.status === 'PASS' ? '✅' : test.status === 'WARNING' ? '⚠️' : '❌'}
                  </span>
                  <h4 className="font-medium">{test.name}</h4>
                </div>
                
                {test.details.length > 0 && (
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Detalles:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {test.details.map((detail, idx) => (
                        <li key={idx}>• {detail}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {test.issues.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-red-700 mb-1">Problemas:</p>
                    <ul className="text-sm text-red-600 space-y-1">
                      {test.issues.map((issue, idx) => (
                        <li key={idx}>• {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex space-x-4">
            <button
              onClick={handleRunDiagnostics}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Ejecutar de Nuevo
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Recargar Página
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemDiagnostics;
