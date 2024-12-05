import { LogManager } from '../core/LogManager.js';
import { formatTimestamp } from '../utils/dateFormatter.js';

export class SidePanel {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.sections = {
      logs: null,
      inventory: null,
      info: null,
      quests: null,
      stats: null
    };
    this.logManager = LogManager.getInstance();

    // Configurable options
    this.options = {
      maxLogEntries: 100,
      autoScroll: true,
      sectionHeight: '200px', // Fixed height for sections
      theme: {
        background: '#1a1a2e',
        headerBackground: '#16213e',
        headerColor: '#e94560',
        contentBackground: '#0f3460'
      },
      ...options
    };

    // Tracked game state
    this.state = {
      inventory: [],
      quests: [],
      playerStats: {}
    };
  }

  init() {
    this.createSections();
    this.setupLogSubscription();
    this.applyCustomStyling();
    return this;
  }

  applyCustomStyling() {
    // Apply custom theme if container exists
    if (this.container) {
      this.container.style.backgroundColor = this.options.theme.background;
      
      const sections = this.container.querySelectorAll('.side-panel-section');
      sections.forEach(section => {
        const header = section.querySelector('.section-header');
        const content = section.querySelector('.section-content');
        
        // Consistent section styling
        section.style.height = this.options.sectionHeight;
        section.style.display = 'flex';
        section.style.flexDirection = 'column';
        
        if (header) {
          header.style.backgroundColor = this.options.theme.headerBackground;
          header.style.color = this.options.theme.headerColor;
          header.style.flexShrink = '0'; // Prevent header from shrinking
          header.style.padding = '10px';
        }
        
        if (content) {
          content.style.backgroundColor = this.options.theme.contentBackground;
          content.style.flexGrow = '1'; // Allow content to fill remaining space
          content.style.overflowY = 'auto'; // Make content scrollable
          content.style.padding = '10px';
          content.style.maxHeight = `calc(${this.options.sectionHeight} - 50px)`; // Subtract header height
        }
      });
    }
  }

  createSections() {
    // Create standard sections with optional custom order
    const sectionConfig = [
      { key: 'logs', title: 'Logs' },
      { key: 'quests', title: 'Active Quests' },
      { key: 'inventory', title: 'Inventory' },
      { key: 'stats', title: 'Player Stats' },
      { key: 'info', title: 'Information' }
    ];

    sectionConfig.forEach(section => {
      this.sections[section.key] = this.createSection(section.title, `game-${section.key}`);
    });
  }

  createSection(title, id) {
    const section = document.createElement('div');
    section.className = 'side-panel-section';
    section.id = id;
    section.setAttribute('data-section', title.toLowerCase().replace(/\s+/g, '-'));

    const header = document.createElement('div');
    header.className = 'section-header';
    header.textContent = title;

    const content = document.createElement('div');
    content.className = 'section-content';
    content.setAttribute('aria-label', `${title} content`);

    // Add collapse/expand functionality
    header.addEventListener('click', () => {
      section.classList.toggle('collapsed');
    });

    section.appendChild(header);
    section.appendChild(content);
    this.container.appendChild(section);

    return content;
  }

  setupLogSubscription() {
    this.logManager.subscribe((log) => {
      this.addLog(log);
      this.manageLogs();
    });
  }

  manageLogs() {
    // Limit log entries to prevent performance issues
    const logsSection = this.sections.logs;
    const maxEntries = this.options.maxLogEntries;
    
    if (logsSection.children.length > maxEntries) {
      // Remove oldest logs
      while (logsSection.children.length > maxEntries) {
        logsSection.removeChild(logsSection.firstChild);
      }
    }
  }

  addLog(log) {
    const entry = document.createElement('div');
    entry.className = `log-entry log-type-${log.type}`;
    entry.setAttribute('data-log-id', log.id);
    
    const timestamp = document.createElement('span');
    timestamp.className = 'log-timestamp';
    timestamp.textContent = formatTimestamp(log.timestamp);
    
    const message = document.createElement('span');
    message.className = 'log-message';
    message.textContent = ` ${log.message}`;
    
    entry.appendChild(timestamp);
    entry.appendChild(message);
    
    this.sections.logs.appendChild(entry);
    
    // Optional: auto-scroll if enabled
    if (this.options.autoScroll) {
      this.sections.logs.scrollTop = this.sections.logs.scrollHeight;
    }
  }

  updateInventory(items) {
    const inventorySection = this.sections.inventory;
    inventorySection.innerHTML = '';
    
    // More detailed inventory rendering
    items.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'inventory-item';
      
      const itemName = document.createElement('span');
      itemName.className = 'item-name';
      itemName.textContent = item.name || item;
      
      const itemQuantity = document.createElement('span');
      itemQuantity.className = 'item-quantity';
      itemQuantity.textContent = `x${item.quantity || 1}`;
      
      itemElement.appendChild(itemName);
      itemElement.appendChild(itemQuantity);
      
      inventorySection.appendChild(itemElement);
    });

    // Update tracked state
    this.state.inventory = items;
  }

  updateQuests(quests) {
    const questSection = this.sections.quests;
    questSection.innerHTML = '';
    
    quests.forEach(quest => {
      const questElement = document.createElement('div');
      questElement.className = `quest-item ${quest.status}`;
      
      const questName = document.createElement('span');
      questName.className = 'quest-name';
      questName.textContent = quest.name;
      
      const questProgress = document.createElement('div');
      questProgress.className = 'quest-progress';
      questProgress.style.width = `${quest.progress || 0}%`;
      
      questElement.appendChild(questName);
      questElement.appendChild(questProgress);
      
      questSection.appendChild(questElement);
    });

    // Update tracked state
    this.state.quests = quests;
  }

  updatePlayerStats(stats) {
    const statsSection = this.sections.stats;
    statsSection.innerHTML = '';
    
    Object.entries(stats).forEach(([statName, statValue]) => {
      const statElement = document.createElement('div');
      statElement.className = 'player-stat';
      
      const statNameEl = document.createElement('span');
      statNameEl.className = 'stat-name';
      statNameEl.textContent = statName;
      
      const statValueEl = document.createElement('span');
      statValueEl.className = 'stat-value';
      statValueEl.textContent = statValue;
      
      statElement.appendChild(statNameEl);
      statElement.appendChild(statValueEl);
      
      statsSection.appendChild(statElement);
    });

    // Update tracked state
    this.state.playerStats = stats;
  }

  updateInfo(info) {
    this.sections.info.innerHTML = info;
  }

  // New method to get current state
  getState() {
    return { ...this.state };
  }

  // Method to reset or clear specific sections
  clear(section = 'all') {
    switch(section) {
      case 'logs':
        this.sections.logs.innerHTML = '';
        break;
      case 'inventory':
        this.sections.inventory.innerHTML = '';
        this.state.inventory = [];
        break;
      case 'quests':
        this.sections.quests.innerHTML = '';
        this.state.quests = [];
        break;
      case 'stats':
        this.sections.stats.innerHTML = '';
        this.state.playerStats = {};
        break;
      case 'info':
        this.sections.info.innerHTML = '';
        break;
      case 'all':
      default:
        Object.values(this.sections).forEach(section => {
          section.innerHTML = '';
        });
        this.state = {
          inventory: [],
          quests: [],
          playerStats: {}
        };
    }
  }
}