namespace K8047CsDemoApp {
    partial class MainForm {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing) {
            if (disposing && (components != null)) {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent() {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(MainForm));
            this.MainForm_NotifyIcon = new System.Windows.Forms.NotifyIcon(this.components);
            this.MainForm_contextMenuStrip1 = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.exitToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.aboutToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.minimizeToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.closeThisMenuToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.MainForm_contextMenuStrip2 = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.differentContextMenuExampleToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.closeThisMenuToolStripMenuItem1 = new System.Windows.Forms.ToolStripMenuItem();
            this.MainForm_contextMenuStrip1.SuspendLayout();
            this.MainForm_contextMenuStrip2.SuspendLayout();
            this.SuspendLayout();
            // 
            // MainForm_NotifyIcon
            // 
            this.MainForm_NotifyIcon.Icon = ((System.Drawing.Icon)(resources.GetObject("MainForm_NotifyIcon.Icon")));
            this.MainForm_NotifyIcon.Text = "Single Right Click for K8047CsDemoApp";
            // 
            // MainForm_contextMenuStrip1
            // 
            this.MainForm_contextMenuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.exitToolStripMenuItem,
            this.aboutToolStripMenuItem,
            this.minimizeToolStripMenuItem,
            this.closeThisMenuToolStripMenuItem});
            this.MainForm_contextMenuStrip1.Name = "contextMenuStrip1";
            this.MainForm_contextMenuStrip1.Size = new System.Drawing.Size(216, 92);
            // 
            // exitToolStripMenuItem
            // 
            this.exitToolStripMenuItem.Name = "exitToolStripMenuItem";
            this.exitToolStripMenuItem.Size = new System.Drawing.Size(215, 22);
            this.exitToolStripMenuItem.Text = "Exit";
            // 
            // aboutToolStripMenuItem
            // 
            this.aboutToolStripMenuItem.Name = "aboutToolStripMenuItem";
            this.aboutToolStripMenuItem.Size = new System.Drawing.Size(215, 22);
            this.aboutToolStripMenuItem.Text = "About";
            // 
            // minimizeToolStripMenuItem
            // 
            this.minimizeToolStripMenuItem.Name = "minimizeToolStripMenuItem";
            this.minimizeToolStripMenuItem.Size = new System.Drawing.Size(215, 22);
            this.minimizeToolStripMenuItem.Text = "Display K8047CsDemoApp";
            // 
            // closeThisMenuToolStripMenuItem
            // 
            this.closeThisMenuToolStripMenuItem.Name = "closeThisMenuToolStripMenuItem";
            this.closeThisMenuToolStripMenuItem.Size = new System.Drawing.Size(215, 22);
            this.closeThisMenuToolStripMenuItem.Text = "Close This Menu";
            // 
            // MainForm_contextMenuStrip2
            // 
            this.MainForm_contextMenuStrip2.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.differentContextMenuExampleToolStripMenuItem,
            this.closeThisMenuToolStripMenuItem1});
            this.MainForm_contextMenuStrip2.Name = "contextMenuStrip2";
            this.MainForm_contextMenuStrip2.Size = new System.Drawing.Size(243, 48);
            // 
            // differentContextMenuExampleToolStripMenuItem
            // 
            this.differentContextMenuExampleToolStripMenuItem.Name = "differentContextMenuExampleToolStripMenuItem";
            this.differentContextMenuExampleToolStripMenuItem.Size = new System.Drawing.Size(242, 22);
            this.differentContextMenuExampleToolStripMenuItem.Text = "Different Context Menu Example";
            // 
            // closeThisMenuToolStripMenuItem1
            // 
            this.closeThisMenuToolStripMenuItem1.Name = "closeThisMenuToolStripMenuItem1";
            this.closeThisMenuToolStripMenuItem1.Size = new System.Drawing.Size(242, 22);
            this.closeThisMenuToolStripMenuItem1.Text = "Close This Menu";
            // 
            // Form1
            //
            this.Load += new System.EventHandler(this.K8047CsDemoApp_MainForm_Initialize);
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(441, 286);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Name = "Form1";
            this.MainForm_contextMenuStrip1.ResumeLayout(false);
            this.MainForm_contextMenuStrip2.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.NotifyIcon MainForm_NotifyIcon;
        private System.Windows.Forms.ContextMenuStrip MainForm_contextMenuStrip1;
        private System.Windows.Forms.ToolStripMenuItem aboutToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem exitToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem minimizeToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem closeThisMenuToolStripMenuItem;
        private System.Windows.Forms.ContextMenuStrip MainForm_contextMenuStrip2;
        private System.Windows.Forms.ToolStripMenuItem differentContextMenuExampleToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem closeThisMenuToolStripMenuItem1;
    }
}

