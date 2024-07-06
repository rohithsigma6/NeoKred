import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const MarkdownConverter = () => {
  const [markdown, setMarkdown] = useState('');
  const [html, setHtml] = useState('');
   

  const previousMarkdownRef = useRef('');

  const debouncedMarkdown = useDebounce(markdown, 500);

  const insertMarkdown = (markdown) => {
    setMarkdown((prevText) => `${prevText}${markdown}`);
  };

  const handleChange = (event) => {
    setMarkdown(event.target.value);
  };

  useEffect(() => {
    const handleConversion = async () => {
      if (debouncedMarkdown) {
        try {
          const response = await fetch(
            `http://localhost:3001/convert?markdown=${encodeURIComponent(
              debouncedMarkdown
            )}`
          );
          const newHtml = await response.text();

          setHtml(newHtml);
        } catch (error) {
          console.error('Error converting Markdown:', error);
        }
      }
      previousMarkdownRef.current = debouncedMarkdown;
    };

    if (debouncedMarkdown !== previousMarkdownRef.current) {
      handleConversion();
    }
  }, [debouncedMarkdown]);



  return (
    <div className="container">
      <header className="header">
        <h1>Markdown Editor</h1>
        <p>A simple markdown editor made with React.</p>
        <h1>Documentation</h1>
        <p># - header-1</p>
        <p>## - header-2</p>
        <p>### - header-3</p>
        <p>#### - header-4</p>
        <p>##### - header-5</p>
        <p>###### - header-6</p>
        <p>**bold** - bold text</p>
        <p>*italic* - italic text</p>
        <p>[link](url) - link</p>
        <p>![image](url) - image</p>
        <p>`code` - inline code</p>
        <p>```code``` - code block</p>
        <p>- list item - unordered list item</p>
        <p>1. list item - ordered list item</p>
        <p>'&gt' blockquote - blockquote</p>
        <p>--- - horizontal rule</p>
        <p>| Header | Header | - table header</p>
        <p>| --- | --- | - table separator</p>
        <p>| Cell | Cell | - table cell</p>
        <p>- [ ] task - task list item</p>
      </header>
      <div className="left-panel">
        <h1>Quick options</h1>
        <div className="button-group">
          <button onClick={() => insertMarkdown('# ')}>h1</button>
          <button onClick={() => insertMarkdown('## ')}>h2</button>
          <button onClick={() => insertMarkdown('### ')}>h3</button>
          <button onClick={() => insertMarkdown('#### ')}>h4</button>
          <button onClick={() => insertMarkdown('**bold**')}>Bold</button>
          <button onClick={() => insertMarkdown('*italic*')}>Italic</button>
          <button onClick={() => insertMarkdown('[link](url)')}>Link</button>
          <button onClick={() => insertMarkdown('![image](url)')}>Image</button>
          <button onClick={() => insertMarkdown('`code`')}>Inline Code</button>
          <button onClick={() => insertMarkdown('\n```\ncode\n```\n')}>Code Block</button>
          <button onClick={() => insertMarkdown('- ')}>Unordered List</button>
          <button onClick={() => insertMarkdown('1. ')}>Ordered List</button>
          <button onClick={() => insertMarkdown('> ')}>Blockquote</button>
          <button onClick={() => insertMarkdown('\n---\n')}>Horizontal Rule</button>
          <button onClick={() => insertMarkdown('- [ ] ')}>Task List</button>
          <button onClick={() => insertMarkdown('~~strikethrough~~')}>Strikethrough</button>
          <button onClick={() => insertMarkdown('![alt text](image url)')}>Image with Alt Text</button>
        </div>
        <textarea
          placeholder="Type here..."
          value={markdown}
          onChange={handleChange}
        />
      </div>
      <div className="right-panel">
        <div className="button-bar">
          <button >Preview</button>
         
        </div>
        <div className="output">
          
            <div dangerouslySetInnerHTML={{ __html: html }} />
          
        </div>
      </div>
    </div>
  );
};

export default MarkdownConverter;
