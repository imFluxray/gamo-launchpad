// nav.js - Shell-aware navigation for music persistence
// This script ensures all navigation happens within the shell's iframe
// so the music player never reloads

(function() {
    'use strict';
    
    // Check if we're inside the shell's iframe
    function isInShell() {
        try {
            // If window.parent has navigateTo, we're in the shell
            return window.parent !== window && typeof window.parent.navigateTo === 'function';
        } catch (e) {
            return false;
        }
    }
    
    // Check if we ARE the shell
    function isShell() {
        return document.getElementById('content-frame') !== null;
    }
    
    // Navigate to a path - works from anywhere
    window.goTo = function(path) {
        // Don't navigate if path is empty
        if (!path) return;
        
        // If we're in the shell's iframe, tell the parent to navigate
        if (isInShell()) {
            window.parent.navigateTo(path);
            return;
        }
        
        // If we're the shell itself, navigate the iframe
        if (isShell()) {
            window.navigateTo(path);
            return;
        }
        
        // We're standalone (not in shell) - redirect to shell with hash path
        // This ensures the shell loads and then navigates to the right page
        const shellUrl = '/#' + path;
        window.location.href = shellUrl;
    };
    
    // Auto-redirect to shell if loaded standalone (except for special pages)
    function ensureInShell() {
        const currentPath = window.location.pathname;
        
        // Don't redirect these pages - they should work standalone
        const standalonePages = ['/d', '/tabs.html', '/rx'];
        if (standalonePages.some(p => currentPath === p || currentPath.startsWith(p))) {
            return;
        }
        
        // Don't redirect if we're already in shell or ARE the shell
        if (isInShell() || isShell()) {
            return;
        }
        
        // Don't redirect the root path
        if (currentPath === '/' || currentPath === '') {
            return;
        }
        
        // Redirect to shell with current page as hash
        // This causes shell.html to load with the content iframe pointing here
        const targetPath = currentPath + window.location.search;
        window.location.href = '/#' + targetPath;
    }
    
    // Run on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensureInShell);
    } else {
        ensureInShell();
    }
})();
