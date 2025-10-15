export interface TodoItem {
  filePath: string;
  lineNumber: number;
  content: string;
  priority?: 'high' | 'medium' | 'low';
  assignee?: string;
  tags?: string[];
}

export interface TodoExtractorConfig {
  includeFileTypes: string[];
  excludeFolders: string[];
  excludePatterns: string[];
  notionApiKey?: string;
  notionDatabaseId?: string;
  slackWebhookUrl?: string;
  assigneePatterns: string;
  tagPatterns: string;
}

export interface ExportOptions {
  outputPath?: string;
  format: 'txt' | 'json' | 'csv';
}
