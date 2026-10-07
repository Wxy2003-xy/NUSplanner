import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, ArrowRight, BookOpen, Check, Loader, Search, X } from 'react-feather';
import { ModuleSelectionBoxProps } from '../../../types/general';
import { CardType } from '../../../types/studyplan';
import PrereqTreeVisual from './TreeVisualization';
import './ModuleSelection.css';

type ModuleListItem = {
  moduleCode: string;
  title: string;
};

type NusModsModule = {
  moduleCode: string;
  title: string;
  moduleCredit: number;
  semesterData: Array<{
    semester: number;
    examDate?: string;
    examDuration?: number;
  }>;
  prereqTree?: CardType['prereqTree'];
  preclusionRule?: string;
};

const getCurrentAcademicYear = () => {
  const now = new Date();
  const startYear = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;
  return `${startYear}-${startYear + 1}`;
};

const extractCourseCodes = (rule = ''): string[] => {
  const coursePattern = /\b([A-Z]{2,}[0-9]{4}[A-Z]{0,2}):[A-Z]\b/g;
  const matches: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = coursePattern.exec(rule)) !== null) {
    if (match[1]) matches.push(match[1]);
  }

  return matches;
};

const ModuleSelectionBox: React.FC<ModuleSelectionBoxProps> = ({
  setTempCard,
  onConfirm,
  onClose,
  destinationLabel,
}) => {
  const [acadYear, setAcadYear] = useState(() => localStorage.getItem('acadYear') || getCurrentAcademicYear());
  const [moduleCode, setModuleCode] = useState('');
  const [moduleInfo, setModuleInfo] = useState<CardType | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListLoading, setIsListLoading] = useState(false);
  const [moduleList, setModuleList] = useState<ModuleListItem[]>([]);
  const [suggestions, setSuggestions] = useState<ModuleListItem[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const academicYears = useMemo(() => {
    const currentStartYear = Number(getCurrentAcademicYear().split('-')[0]);
    const recentYears = Array.from({ length: 6 }, (_, index) => {
      const year = currentStartYear - index;
      return `${year}-${year + 1}`;
    });

    return recentYears.includes(acadYear) ? recentYears : [acadYear, ...recentYears];
  }, [acadYear]);

  useEffect(() => {
    localStorage.setItem('acadYear', acadYear);
  }, [acadYear]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  useEffect(() => {
    if (!acadYear) return;

    const controller = new AbortController();
    const fetchModuleList = async () => {
      const startYear = acadYear.split('-')[0];
      const nextYear = Number(startYear) + 1;
      setIsListLoading(true);
      setError('');

      try {
        const response = await fetch(
          `https://api.nusmods.com/v2/${startYear}-${nextYear}/moduleList.json`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error('Course catalogue unavailable');

        const data = (await response.json()) as ModuleListItem[];
        setModuleList(data.map(({ moduleCode: code, title }) => ({ moduleCode: code, title })));
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
        setModuleList([]);
        setError('We could not load the course catalogue for this academic year. Try another year or retry shortly.');
      } finally {
        if (!controller.signal.aborted) setIsListLoading(false);
      }
    };

    fetchModuleList();
    return () => controller.abort();
  }, [acadYear]);

  const updateSuggestions = (value: string) => {
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    setSuggestions(
      moduleList
        .filter(({ moduleCode: code, title }) =>
          code.startsWith(value) || title.toUpperCase().includes(value),
        )
        .slice(0, 6),
    );
  };

  const handleModuleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value.toUpperCase().trimStart();
    setModuleCode(input);
    setModuleInfo(null);
    setError('');
    updateSuggestions(input);
  };

  const handleSuggestionClick = (suggestion: ModuleListItem) => {
    setModuleCode(suggestion.moduleCode);
    setSuggestions([]);
    setModuleInfo(null);
    setError('');
  };

  const fetchModuleInfo = async () => {
    const startYear = acadYear.split('-')[0];
    const nextYear = Number(startYear) + 1;
    const normalizedCode = moduleCode.trim().toUpperCase();
    setIsLoading(true);
    setError('');
    setModuleInfo(null);

    try {
      const response = await fetch(
        `https://api.nusmods.com/v2/${startYear}-${nextYear}/modules/${normalizedCode}.json`,
      );
      if (!response.ok) throw new Error('Course not found');

      const data = (await response.json()) as NusModsModule;
      const card: CardType = {
        id: Date.now(),
        name: data.moduleCode,
        semester: data.semesterData.map(({ semester }) => semester),
        content: data.title,
        courseCredit: data.moduleCredit,
        prereqTree: data.prereqTree,
        preclusionRule: extractCourseCodes(data.preclusionRule),
        examInfo: data.semesterData.map(({ examDate, examDuration }) => ({
          examTime: examDate,
          examDuration,
        })),
      };

      setTempCard(card);
      setModuleInfo(card);
    } catch {
      setError(`We couldn't find ${normalizedCode || 'that course'} in the ${acadYear} catalogue.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (acadYear && moduleCode.trim()) fetchModuleInfo();
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.currentTarget === event.target) onClose();
  };

  return (
    <div className="module-drawer-backdrop" onMouseDown={handleBackdropClick}>
      <aside
        className="module-selection-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="module-drawer-title"
      >
        <header className="module-drawer-header">
          <div className="module-drawer-heading">
            <span className="module-drawer-icon" aria-hidden="true"><BookOpen size={19} /></span>
            <div>
              <p className="module-drawer-eyebrow">Add to {destinationLabel || 'your plan'}</p>
              <h2 id="module-drawer-title">Find a course</h2>
            </div>
          </div>
          <button className="close-module-selection" type="button" onClick={onClose} aria-label="Close course search">
            <X size={20} />
          </button>
        </header>

        <div className="module-drawer-body">
          <div className="module-drawer-progress" aria-label="Two-step course selection">
            <span className="is-active"><b>1</b> Search</span>
            <ArrowRight size={14} aria-hidden="true" />
            <span className={moduleInfo ? 'is-active' : ''}><b>2</b> Review</span>
          </div>

          <form className="module-search-form" onSubmit={handleSubmit}>
            <div className="module-form-field">
              <label htmlFor="acadYear">Academic year</label>
              <select
                id="acadYear"
                name="acadYear"
                value={acadYear}
                onChange={(event) => {
                  setAcadYear(event.target.value);
                  setModuleInfo(null);
                  setSuggestions([]);
                }}
                required
              >
                {academicYears.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
              <p className="module-field-hint">Future semesters use the latest available NUSMods catalogue and may change.</p>
            </div>

            <div className="module-form-field module-code-field">
              <label htmlFor="moduleCode">Course code or title</label>
              <div className="module-search-input">
                <Search size={17} aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="text"
                  id="moduleCode"
                  name="moduleCode"
                  value={moduleCode}
                  onChange={handleModuleCodeChange}
                  placeholder="Try CS1101S or Programming"
                  autoComplete="off"
                  aria-autocomplete="list"
                  aria-expanded={suggestions.length > 0}
                  aria-controls="module-suggestions"
                  required
                />
              </div>
              {suggestions.length > 0 && (
                <ul id="module-suggestions" className="suggestions-list" role="listbox">
                  {suggestions.map((suggestion) => (
                    <li key={suggestion.moduleCode}>
                      <button type="button" onClick={() => handleSuggestionClick(suggestion)}>
                        <strong>{suggestion.moduleCode}</strong>
                        <span>{suggestion.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {isListLoading && <p className="module-field-hint module-catalogue-status"><Loader size={13} /> Loading catalogue…</p>}
            </div>

            <button className="fetchinfo-button" type="submit" disabled={isLoading || !acadYear || !moduleCode.trim()}>
              {isLoading ? <><Loader className="module-spinner" size={16} /> Checking course…</> : <>Review course <ArrowRight size={16} /></>}
            </button>
          </form>

          {error && (
            <div className="module-error" role="alert">
              <AlertCircle size={18} aria-hidden="true" />
              <p><strong>Something went wrong</strong><span>{error}</span></p>
            </div>
          )}

          {moduleInfo && (
            <section className="module-review" aria-live="polite">
              <div className="module-review-card">
                <div className="module-review-title">
                  <span className="module-code-badge">{moduleInfo.name}</span>
                  <span className="module-credit-badge">{moduleInfo.courseCredit} units</span>
                </div>
                <h3>{moduleInfo.content}</h3>
                <div className="module-review-meta">
                  <div><span>Offered in</span><strong>{moduleInfo.semester.map((semester) => `Semester ${semester}`).join(', ')}</strong></div>
                  <div><span>Preclusions</span><strong>{moduleInfo.preclusionRule?.length ? moduleInfo.preclusionRule.join(', ') : 'None listed'}</strong></div>
                </div>
              </div>

              <div className="tree-section">
                <div className="tree-section-heading">
                  <div>
                    <p>Course pathway</p>
                    <h3>Prerequisite map</h3>
                  </div>
                  <span className="tree-legend"><i /> Required course</span>
                </div>
                <p className="tree-help">Read from left to right. Branch labels show whether every course—or just one option—is required.</p>
                <div className="tree-container-select">
                  <PrereqTreeVisual data={moduleInfo.prereqTree} />
                </div>
              </div>
            </section>
          )}
        </div>

        <footer className="module-drawer-footer">
          <button className="module-cancel-button" type="button" onClick={onClose}>Cancel</button>
          <button
            className="confirm-button"
            type="button"
            onClick={() => moduleInfo && onConfirm(moduleInfo)}
            disabled={!moduleInfo}
          >
            <Check size={17} /> Add to {destinationLabel || 'plan'}
          </button>
        </footer>
      </aside>
    </div>
  );
};

export default ModuleSelectionBox;
