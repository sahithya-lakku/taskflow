import { jsPDF } from 'jspdf';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { api } from '../services/api';
import { useProjectStore } from '../store/projectStore';

export default function ReportsPage() {
  const projects = useProjectStore((s) => s.projects);
  const [reportData, setReportData] = useState(null);

  const generate = async () => {
    if (!projects[0]?.id) return;
    const { data } = await api.get(`/projects/${projects[0].id}/report`);
    setReportData(data.data);
  };

  useEffect(() => {
    generate();
  }, [projects]);

  const downloadPdf = () => {
    if (!reportData) return;
    const doc = new jsPDF();
    doc.text(`TaskFlow Report - ${new Date().toLocaleString()}`, 10, 10);
    doc.text(`Tasks: ${reportData.json.totals.tasks}`, 10, 20);
    doc.text(`Completed: ${reportData.json.totals.completed}`, 10, 30);
    doc.save('taskflow-report.pdf');
  };

  const downloadCsv = () => {
    if (!reportData) return;
    const blob = new Blob([reportData.csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'taskflow-report.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Navbar />
      <main className="mx-auto lg:ml-64 max-w-4xl px-4 py-6">
        <h1 className="section-title mb-4">Reports</h1>
        <div className="glass-card p-4 space-y-3">
          <button className="btn-primary mr-2" onClick={generate}>Generate report</button>
          <button className="btn-primary mr-2" onClick={downloadPdf}>Download PDF</button>
          <button className="btn-primary" onClick={downloadCsv}>Download CSV</button>
        </div>
      </main>
    </div>
  );
}
