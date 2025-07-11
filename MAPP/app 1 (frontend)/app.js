// GAPs Optimizer - Bosch Application
class GapsOptimizer {
    constructor() {
        this.data = {
            kpis: {
                ultimaAtualizacao: "10/07/2025 14:30",
                itensProcessados: 847,
                divergencias: 23,
                precisao: 97.3
            },
            progressSteps: [
                {"id": 1, "title": "Autenticação", "description": "Conectando ao sistema Bosch..."},
                {"id": 2, "title": "Consolidação", "description": "Unindo dados RBLA e Regional..."},
                {"id": 3, "title": "Filtragem", "description": "Aplicando filtros temporais..."},
                {"id": 4, "title": "Comparação", "description": "Executando anti-join entre períodos..."},
                {"id": 5, "title": "Validação", "description": "Verificando integridade dos dados..."},
                {"id": 6, "title": "Exportação", "description": "Gerando relatórios..."},
                {"id": 7, "title": "Relatório", "description": "Atualizando dashboard..."},
                {"id": 8, "title": "Conclusão", "description": "Processo finalizado com sucesso!"}
            ],
            tableData: [
                {"planta": "PLT001", "partnumber": "PN1008", "status": "Não Identificado", "valor": "R$ 15.430,00", "prioridade": "Alta"},
                {"planta": "PLT002", "partnumber": "PN1012", "status": "Processado", "valor": "R$ 8.250,00", "prioridade": "Média"},
                {"planta": "PLT003", "partnumber": "PN1015", "status": "Não Identificado", "valor": "R$ 22.100,00", "prioridade": "Alta"},
                {"planta": "PLT001", "partnumber": "PN1018", "status": "Processado", "valor": "R$ 5.680,00", "prioridade": "Baixa"},
                {"planta": "PLT004", "partnumber": "PN1021", "status": "Não Identificado", "valor": "R$ 31.200,00", "prioridade": "Crítica"},
                {"planta": "PLT002", "partnumber": "PN1025", "status": "Processado", "valor": "R$ 12.750,00", "prioridade": "Média"},
                {"planta": "PLT003", "partnumber": "PN1029", "status": "Processado", "valor": "R$ 9.400,00", "prioridade": "Baixa"},
                {"planta": "PLT005", "partnumber": "PN1033", "status": "Não Identificado", "valor": "R$ 18.900,00", "prioridade": "Alta"},
                {"planta": "PLT001", "partnumber": "PN1037", "status": "Processado", "valor": "R$ 7.320,00", "prioridade": "Média"},
                {"planta": "PLT004", "partnumber": "PN1041", "status": "Não Identificado", "valor": "R$ 25.600,00", "prioridade": "Alta"}
            ],
            chartData: {
                labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
                processados: [245, 389, 421, 567, 694, 847],
                divergencias: [12, 18, 15, 25, 31, 23]
            },
            codeTemplates: {
                frontend: `<!-- HTML Template -->
<div class="dashboard-card">
  <h3>KPI Card</h3>
  <p class="metric">{{value}}</p>
</div>

<style>
.dashboard-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.metric {
  font-size: 2rem;
  font-weight: bold;
  color: #DC0029;
}
</style>

<script>
// Atualizar métricas
function updateMetrics(data) {
    document.querySelector('.metric').textContent = data.value;
}
</script>`,
                backend: `# Python Template - Processamento GAPs
import pandas as pd
import numpy as np
from datetime import datetime

def process_gaps_data(file_path):
    """
    Processa dados de GAPs entre RBLA e Regional
    """
    try:
        # Carrega dados
        df = pd.read_excel(file_path)
        
        # Filtra dados
        df_filtered = df[df['status'] == 'Não Identificado']
        
        # Calcula métricas
        metrics = {
            'total_items': len(df),
            'divergencias': len(df_filtered),
            'precisao': ((len(df) - len(df_filtered)) / len(df)) * 100
        }
        
        return df_filtered, metrics
        
    except Exception as e:
        print(f"Erro ao processar: {e}")
        return None, None

# Exemplo de uso
if __name__ == "__main__":
    data, metrics = process_gaps_data('gaps_data.xlsx')
    print(f"Precisão: {metrics['precisao']:.1f}%")`,
                automation: `// Power Query M Template - Automação GAPs
let
    // Fonte de dados RBLA
    Source_RBLA = Excel.Workbook(File.Contents("RBLA_Data.xlsx")),
    RBLA_Table = Source_RBLA{[Item="Sheet1"]}[Data],
    
    // Fonte de dados Regional
    Source_Regional = Excel.Workbook(File.Contents("Regional_Data.xlsx")),
    Regional_Table = Source_Regional{[Item="Sheet1"]}[Data],
    
    // Combinar dados
    Combined_Data = Table.Combine({RBLA_Table, Regional_Table}),
    
    // Filtrar por período
    Filtered_Data = Table.SelectRows(Combined_Data, 
        each [Data] >= Date.StartOfMonth(Date.From(DateTime.LocalNow()))),
    
    // Anti-join para encontrar divergências
    Divergencias = Table.SelectRows(Filtered_Data,
        each [Status] = "Não Identificado"),
    
    // Adicionar colunas calculadas
    Final_Table = Table.AddColumn(Divergencias, "Prioridade", 
        each if [Valor] > 25000 then "Crítica"
        else if [Valor] > 15000 then "Alta"
        else if [Valor] > 8000 then "Média"
        else "Baixa")
        
in
    Final_Table`
            }
        };
        
        this.originalData = [...this.data.tableData];
        this.filteredData = [...this.data.tableData];
        this.currentStep = 0;
        this.progressInterval = null;
        this.chart = null;
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.isProcessing = false;
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    init() {
        console.log('Initializing GAPs Optimizer...');
        
        // Initialize components in order
        this.setupTabNavigation();
        this.setupEyeProtection();
        this.setupGapsUpdate();
        this.setupChart();
        this.setupTable();
        this.setupCodeEditor();
        this.updateKPIs();
        this.addActivityLog('Sistema iniciado', 'success');
        
        console.log('GAPs Optimizer initialized successfully');
    }
    
    // Tab Navigation
    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        console.log('Setting up tab navigation...', tabButtons.length, 'tabs found');
        
        tabButtons.forEach((button, index) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const targetTab = button.dataset.tab;
                console.log(`Switching to tab: ${targetTab}`);
                
                // Update active tab button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Update active tab content
                tabContents.forEach(content => content.classList.remove('active'));
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                    console.log(`Tab switched to: ${targetTab}`);
                } else {
                    console.error(`Tab content not found: ${targetTab}`);
                }
                
                this.addActivityLog(`Navegou para ${targetTab}`, 'info');
            });
        });
    }
    
    // Eye Protection System
    setupEyeProtection() {
        const eyeButtons = document.querySelectorAll('.eye-btn');
        const overlay = document.getElementById('eyeProtectionOverlay');
        
        console.log('Setting up eye protection...', eyeButtons.length, 'buttons found');
        
        eyeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const level = button.dataset.level;
                
                console.log(`Eye protection level: ${level}`);
                
                // Update active button
                eyeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Remove all protection classes
                document.body.classList.remove('eye-protection-light', 'eye-protection-medium', 'eye-protection-intense');
                overlay.classList.remove('light', 'medium', 'intense');
                
                // Apply protection if not off
                if (level !== 'off') {
                    document.body.classList.add(`eye-protection-${level}`);
                    overlay.classList.add(level);
                }
                
                this.addActivityLog(`Proteção ocular: ${level}`, 'info');
            });
        });
    }
    
    // GAPs Update Process
    setupGapsUpdate() {
        const updateBtn = document.getElementById('updateGapsBtn');
        const drawer = document.getElementById('progressDrawer');
        const closeBtn = document.getElementById('closeDrawer');
        
        console.log('Setting up GAPs update...', updateBtn ? 'button found' : 'button not found');
        
        if (updateBtn) {
            updateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (!this.isProcessing) {
                    this.startGapsUpdate();
                }
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                drawer.classList.remove('open');
                this.isProcessing = false;
                if (this.progressInterval) {
                    clearInterval(this.progressInterval);
                    this.progressInterval = null;
                }
            });
        }
    }
    
    startGapsUpdate() {
        console.log('Starting GAPs update...');
        
        if (this.isProcessing) {
            console.log('Process already running');
            return;
        }
        
        this.isProcessing = true;
        const drawer = document.getElementById('progressDrawer');
        const progressFill = document.getElementById('progressFill');
        const stepsContainer = document.getElementById('progressSteps');
        
        if (!drawer || !progressFill || !stepsContainer) {
            console.error('Progress drawer elements not found');
            this.isProcessing = false;
            return;
        }
        
        // Show drawer
        drawer.classList.add('open');
        console.log('Progress drawer opened');
        
        // Reset progress
        progressFill.style.width = '0%';
        
        // Create progress steps
        stepsContainer.innerHTML = '';
        this.data.progressSteps.forEach(step => {
            const stepElement = document.createElement('div');
            stepElement.className = 'progress-step';
            stepElement.id = `step-${step.id}`;
            stepElement.innerHTML = `
                <div class="step-number">${step.id}</div>
                <div class="step-content">
                    <h4>${step.title}</h4>
                    <p>${step.description}</p>
                </div>
            `;
            stepsContainer.appendChild(stepElement);
        });
        
        // Start progress animation
        this.currentStep = 0;
        this.progressInterval = setInterval(() => {
            this.updateProgress();
        }, 1000);
        
        this.addActivityLog('Iniciou atualização GAPs', 'info');
    }
    
    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const steps = document.querySelectorAll('.progress-step');
        
        if (this.currentStep < this.data.progressSteps.length) {
            // Update progress bar
            const progress = ((this.currentStep + 1) / this.data.progressSteps.length) * 100;
            progressFill.style.width = `${progress}%`;
            
            // Update step status
            if (this.currentStep > 0) {
                const prevStep = steps[this.currentStep - 1];
                if (prevStep) {
                    prevStep.classList.remove('active');
                    prevStep.classList.add('completed');
                }
            }
            
            const currentStepElement = steps[this.currentStep];
            if (currentStepElement) {
                currentStepElement.classList.add('active');
            }
            
            console.log(`Progress step ${this.currentStep + 1}/${this.data.progressSteps.length}`);
            this.currentStep++;
        } else {
            // Process complete
            console.log('GAPs update process complete');
            clearInterval(this.progressInterval);
            this.progressInterval = null;
            
            // Complete last step
            const lastStep = steps[this.currentStep - 1];
            if (lastStep) {
                lastStep.classList.remove('active');
                lastStep.classList.add('completed');
            }
            
            // Update data and UI
            setTimeout(() => {
                this.completeGapsUpdate();
            }, 1000);
        }
    }
    
    completeGapsUpdate() {
        console.log('Completing GAPs update...');
        
        // Update KPIs with new data
        this.data.kpis.ultimaAtualizacao = new Date().toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        this.data.kpis.itensProcessados = Math.floor(Math.random() * 100) + 800;
        this.data.kpis.divergencias = Math.floor(Math.random() * 15) + 15;
        this.data.kpis.precisao = parseFloat((97 + Math.random() * 2).toFixed(1));
        
        this.updateKPIs();
        this.updateTable();
        
        // Close drawer
        setTimeout(() => {
            const drawer = document.getElementById('progressDrawer');
            if (drawer) {
                drawer.classList.remove('open');
            }
            this.isProcessing = false;
        }, 2000);
        
        this.showToast('GAPs atualizados com sucesso!', 'success');
        this.addActivityLog('Atualização GAPs concluída', 'success');
    }
    
    // Chart Setup
    setupChart() {
        const ctx = document.getElementById('processChart');
        if (!ctx) {
            console.error('Chart canvas not found');
            return;
        }
        
        console.log('Setting up chart...');
        
        this.chart = new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: this.data.chartData.labels,
                datasets: [{
                    label: 'Processados',
                    data: this.data.chartData.processados,
                    backgroundColor: '#1FB8CD',
                    borderColor: '#1FB8CD',
                    borderWidth: 1
                }, {
                    label: 'Divergências',
                    data: this.data.chartData.divergencias,
                    backgroundColor: '#DC0029',
                    borderColor: '#DC0029',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
        console.log('Chart setup complete');
    }
    
    // Table Setup
    setupTable() {
        console.log('Setting up table...');
        this.updateTable();
        this.setupTableFilters();
        this.setupTableSorting();
        console.log('Table setup complete');
    }
    
    updateTable() {
        const tbody = document.getElementById('tableBody');
        if (!tbody) {
            console.error('Table body not found');
            return;
        }
        
        tbody.innerHTML = '';
        
        this.filteredData.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.planta}</td>
                <td>${row.partnumber}</td>
                <td>${row.status}</td>
                <td>${row.valor}</td>
                <td><span class="priority-${row.prioridade.toLowerCase()}">${row.prioridade}</span></td>
            `;
            tbody.appendChild(tr);
        });
        
        console.log(`Table updated with ${this.filteredData.length} rows`);
    }
    
    setupTableFilters() {
        const plantFilter = document.getElementById('plantFilter');
        const priorityFilter = document.getElementById('priorityFilter');
        
        if (plantFilter) {
            plantFilter.addEventListener('change', (e) => {
                console.log('Plant filter changed:', e.target.value);
                this.filterTable();
            });
        }
        
        if (priorityFilter) {
            priorityFilter.addEventListener('change', (e) => {
                console.log('Priority filter changed:', e.target.value);
                this.filterTable();
            });
        }
        
        console.log('Table filters setup complete');
    }
    
    filterTable() {
        const plantFilter = document.getElementById('plantFilter');
        const priorityFilter = document.getElementById('priorityFilter');
        
        const plantValue = plantFilter ? plantFilter.value : '';
        const priorityValue = priorityFilter ? priorityFilter.value : '';
        
        console.log('Filtering table:', { plant: plantValue, priority: priorityValue });
        
        this.filteredData = this.originalData.filter(row => {
            const matchesPlant = !plantValue || row.planta === plantValue;
            const matchesPriority = !priorityValue || row.prioridade === priorityValue;
            return matchesPlant && matchesPriority;
        });
        
        this.updateTable();
        this.addActivityLog(`Filtros aplicados: Planta=${plantValue || 'Todas'}, Prioridade=${priorityValue || 'Todas'}`, 'info');
    }
    
    setupTableSorting() {
        const headers = document.querySelectorAll('.data-table th[data-sort]');
        
        console.log('Setting up table sorting...', headers.length, 'sortable headers found');
        
        headers.forEach(header => {
            header.addEventListener('click', (e) => {
                e.preventDefault();
                const column = header.dataset.sort;
                console.log('Sorting by column:', column);
                this.sortTable(column);
            });
        });
    }
    
    sortTable(column) {
        console.log(`Sorting table by: ${column}`);
        
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        
        this.filteredData.sort((a, b) => {
            let aVal = a[column];
            let bVal = b[column];
            
            // Convert valores to numbers for sorting
            if (column === 'valor') {
                aVal = parseFloat(aVal.replace(/[^\d,]/g, '').replace(',', '.'));
                bVal = parseFloat(bVal.replace(/[^\d,]/g, '').replace(',', '.'));
            }
            
            let comparison = 0;
            if (aVal > bVal) comparison = 1;
            else if (aVal < bVal) comparison = -1;
            
            return this.sortDirection === 'asc' ? comparison : -comparison;
        });
        
        this.updateTable();
        this.addActivityLog(`Tabela ordenada por ${column} (${this.sortDirection})`, 'info');
    }
    
    // Code Editor Setup
    setupCodeEditor() {
        const codeTabs = document.querySelectorAll('.code-tab');
        const codePanels = document.querySelectorAll('.code-panel');
        const editors = {
            frontend: document.getElementById('frontendEditor'),
            backend: document.getElementById('backendEditor'),
            automation: document.getElementById('automationEditor')
        };
        
        console.log('Setting up code editor...', codeTabs.length, 'tabs found');
        
        // Initialize editors with templates
        Object.keys(editors).forEach(key => {
            const editor = editors[key];
            if (editor) {
                editor.value = this.data.codeTemplates[key];
                editor.addEventListener('input', () => {
                    this.updateCodeInfo(key);
                    this.updatePreview(key);
                });
            }
        });
        
        // Tab switching
        codeTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = tab.dataset.codeTab;
                
                console.log(`Switching to code tab: ${targetTab}`);
                
                // Update active tab
                codeTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update active panel
                codePanels.forEach(p => p.classList.remove('active'));
                const targetPanel = document.getElementById(`${targetTab}-panel`);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
                
                this.updateCodeInfo(targetTab);
                this.addActivityLog(`Abriu editor ${targetTab}`, 'info');
            });
        });
        
        // Code actions
        const saveBtn = document.getElementById('saveCode');
        const runBtn = document.getElementById('runCode');
        const revertBtn = document.getElementById('revertCode');
        
        if (saveBtn) {
            saveBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.saveCode();
            });
        }
        
        if (runBtn) {
            runBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.runCode();
            });
        }
        
        if (revertBtn) {
            revertBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.revertCode();
            });
        }
        
        // Initialize with frontend
        this.updateCodeInfo('frontend');
        console.log('Code editor setup complete');
    }
    
    updateCodeInfo(editorType) {
        const editor = document.getElementById(`${editorType}Editor`);
        if (!editor) return;
        
        const lines = editor.value.split('\n').length;
        const linesElement = document.getElementById('codeLines');
        const statusElement = document.getElementById('codeStatus');
        
        if (linesElement) linesElement.textContent = `${lines} linhas`;
        if (statusElement) statusElement.textContent = 'Modificado';
    }
    
    updatePreview(editorType) {
        const previewContainer = document.getElementById('previewContainer');
        const editor = document.getElementById(`${editorType}Editor`);
        
        if (!previewContainer || !editor) return;
        
        if (editorType === 'frontend') {
            // Simple HTML preview
            previewContainer.innerHTML = `
                <div style="font-size: 0.8rem; color: #666; margin-bottom: 0.5rem;">
                    Preview HTML/CSS/JS:
                </div>
                <div style="background: #f5f5f5; padding: 0.5rem; border-radius: 4px;">
                    ${editor.value.substring(0, 200)}${editor.value.length > 200 ? '...' : ''}
                </div>
            `;
        } else {
            previewContainer.innerHTML = `
                <div style="font-size: 0.8rem; color: #666;">
                    Preview não disponível para ${editorType}
                </div>
            `;
        }
    }
    
    saveCode() {
        const activeTab = document.querySelector('.code-tab.active');
        if (!activeTab) return;
        
        const editorType = activeTab.dataset.codeTab;
        const statusElement = document.getElementById('codeStatus');
        
        if (statusElement) statusElement.textContent = 'Salvo';
        
        this.showToast('Código salvo com sucesso!', 'success');
        this.addActivityLog(`Salvou código ${editorType}`, 'success');
        
        // Add new version
        this.addVersion();
    }
    
    runCode() {
        const activeTab = document.querySelector('.code-tab.active');
        if (!activeTab) return;
        
        const editorType = activeTab.dataset.codeTab;
        
        this.showToast('Código executado com sucesso!', 'success');
        this.addActivityLog(`Executou código ${editorType}`, 'success');
    }
    
    revertCode() {
        const activeTab = document.querySelector('.code-tab.active');
        if (!activeTab) return;
        
        const editorType = activeTab.dataset.codeTab;
        const editor = document.getElementById(`${editorType}Editor`);
        const statusElement = document.getElementById('codeStatus');
        
        if (editor) {
            editor.value = this.data.codeTemplates[editorType];
            this.updateCodeInfo(editorType);
            this.updatePreview(editorType);
        }
        
        if (statusElement) statusElement.textContent = 'Revertido';
        
        this.showToast('Código revertido!', 'info');
        this.addActivityLog(`Reverteu código ${editorType}`, 'info');
    }
    
    addVersion() {
        const versionList = document.getElementById('versionList');
        if (!versionList) return;
        
        const currentVersion = versionList.children.length + 1;
        const timestamp = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        // Remove active from current version
        const activeVersion = versionList.querySelector('.version-item.active');
        if (activeVersion) {
            activeVersion.classList.remove('active');
        }
        
        // Add new version
        const versionItem = document.createElement('div');
        versionItem.className = 'version-item active';
        versionItem.innerHTML = `
            <span class="version-name">v1.0.${currentVersion}</span>
            <span class="version-date">${timestamp}</span>
        `;
        
        versionList.insertBefore(versionItem, versionList.firstChild);
    }
    
    // Update KPIs
    updateKPIs() {
        const elements = {
            lastUpdate: document.getElementById('lastUpdate'),
            itemsProcessed: document.getElementById('itemsProcessed'),
            divergences: document.getElementById('divergences'),
            accuracy: document.getElementById('accuracy')
        };
        
        if (elements.lastUpdate) elements.lastUpdate.textContent = this.data.kpis.ultimaAtualizacao;
        if (elements.itemsProcessed) elements.itemsProcessed.textContent = this.data.kpis.itensProcessados;
        if (elements.divergences) elements.divergences.textContent = this.data.kpis.divergencias;
        if (elements.accuracy) elements.accuracy.textContent = `${this.data.kpis.precisao}%`;
        
        console.log('KPIs updated');
    }
    
    // Activity Log
    addActivityLog(message, type = 'info') {
        const logContainer = document.getElementById('activityLog');
        if (!logContainer) return;
        
        const timestamp = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.innerHTML = `
            <span class="log-time">${timestamp}</span>
            <span class="log-action">${message}</span>
        `;
        
        logContainer.insertBefore(logEntry, logContainer.firstChild);
        
        // Keep only last 10 entries
        while (logContainer.children.length > 10) {
            logContainer.removeChild(logContainer.lastChild);
        }
    }
    
    // Toast Notifications
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Hide and remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (container.contains(toast)) {
                    container.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing application...');
    window.gapsOptimizer = new GapsOptimizer();
});

// Fallback initialization
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('Document already loaded, initializing application...');
    window.gapsOptimizer = new GapsOptimizer();
}