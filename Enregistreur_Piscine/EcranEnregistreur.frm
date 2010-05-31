VERSION 5.00
Begin VB.Form FormMain 
   Caption         =   "Enregistreur Piscine"
   ClientHeight    =   5835
   ClientLeft      =   1485
   ClientTop       =   1875
   ClientWidth     =   9795
   Icon            =   "EcranEnregistreur.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   5835
   ScaleWidth      =   9795
   Begin VB.CheckBox mCheckSimulation 
      Caption         =   "Simulation"
      Height          =   255
      Left            =   8280
      TabIndex        =   24
      Top             =   4080
      Width           =   1215
   End
   Begin VB.PictureBox mPictureYesterday 
      BackColor       =   &H00FFFFC0&
      BorderStyle     =   0  'None
      Height          =   1215
      Left            =   120
      ScaleHeight     =   81
      ScaleMode       =   3  'Pixel
      ScaleWidth      =   633
      TabIndex        =   14
      Top             =   2160
      Width           =   9495
   End
   Begin VB.Frame Frame2 
      Caption         =   "Paramètres"
      Height          =   1215
      Left            =   240
      TabIndex        =   9
      Top             =   4440
      Width           =   3015
      Begin VB.ComboBox mComboGain 
         Height          =   315
         ItemData        =   "EcranEnregistreur.frx":0E42
         Left            =   1440
         List            =   "EcranEnregistreur.frx":0E53
         Style           =   2  'Dropdown List
         TabIndex        =   38
         Top             =   720
         Width           =   1335
      End
      Begin VB.ComboBox mComboCanal 
         Height          =   315
         ItemData        =   "EcranEnregistreur.frx":0E6D
         Left            =   1440
         List            =   "EcranEnregistreur.frx":0E7D
         Style           =   2  'Dropdown List
         TabIndex        =   10
         Top             =   360
         Width           =   1335
      End
      Begin VB.Label Label22 
         Caption         =   "Volts Entrée"
         Height          =   255
         Left            =   120
         TabIndex        =   39
         Top             =   765
         Width           =   1335
      End
      Begin VB.Label Label9 
         Caption         =   "Enregistrer depuis"
         Height          =   255
         Left            =   120
         TabIndex        =   11
         Top             =   400
         Width           =   1335
      End
   End
   Begin VB.Timer mTimer1 
      Interval        =   60000
      Left            =   7680
      Top             =   3720
   End
   Begin VB.CommandButton mBtnStop 
      Caption         =   "Arrêter"
      Height          =   495
      Left            =   1920
      TabIndex        =   8
      Top             =   3720
      Width           =   1455
   End
   Begin VB.Frame Frame1 
      Caption         =   "Dernière Données Enregistreur"
      Height          =   1215
      Left            =   3360
      TabIndex        =   3
      Top             =   4440
      Width           =   6255
      Begin VB.CommandButton mBtnUpdateNow 
         Caption         =   "Mettre à jour"
         Height          =   375
         Left            =   4680
         TabIndex        =   40
         Top             =   720
         Width           =   1455
      End
      Begin VB.TextBox mTextVolt 
         Height          =   285
         Index           =   1
         Left            =   2040
         TabIndex        =   22
         Top             =   840
         Width           =   735
      End
      Begin VB.TextBox mTextVolt 
         Height          =   285
         Index           =   0
         Left            =   1080
         TabIndex        =   21
         Top             =   840
         Width           =   735
      End
      Begin VB.TextBox mTextVolt 
         Height          =   285
         Index           =   3
         Left            =   3720
         TabIndex        =   20
         Top             =   840
         Width           =   735
      End
      Begin VB.TextBox mTextVolt 
         Height          =   285
         Index           =   2
         Left            =   2880
         TabIndex        =   19
         Top             =   840
         Width           =   735
      End
      Begin VB.TextBox mTextLoggerIndex 
         Height          =   285
         Left            =   240
         TabIndex        =   17
         Top             =   840
         Width           =   735
      End
      Begin VB.Label mLabelTime 
         Caption         =   "(heure)"
         Height          =   255
         Left            =   600
         TabIndex        =   23
         Top             =   240
         Width           =   2655
      End
      Begin VB.Label Label36 
         Caption         =   "Index"
         Height          =   255
         Left            =   240
         TabIndex        =   18
         Top             =   600
         Width           =   735
      End
      Begin VB.Label Label4 
         Caption         =   "CH1"
         Height          =   195
         Left            =   1320
         TabIndex        =   7
         Top             =   600
         Width           =   375
      End
      Begin VB.Label Label5 
         Caption         =   "CH2"
         Height          =   195
         Left            =   2160
         TabIndex        =   6
         Top             =   600
         Width           =   375
      End
      Begin VB.Label Label6 
         Caption         =   "CH3"
         Height          =   195
         Left            =   3000
         TabIndex        =   5
         Top             =   600
         Width           =   375
      End
      Begin VB.Label Label7 
         Caption         =   "CH4"
         Height          =   195
         Left            =   3840
         TabIndex        =   4
         Top             =   600
         Width           =   375
      End
   End
   Begin VB.PictureBox mPictureToday 
      BackColor       =   &H00C0FFC0&
      BorderStyle     =   0  'None
      Height          =   1215
      Left            =   120
      ScaleHeight     =   81
      ScaleMode       =   3  'Pixel
      ScaleWidth      =   633
      TabIndex        =   2
      Top             =   360
      Width           =   9495
   End
   Begin VB.CheckBox mCheckLED 
      Caption         =   "Allumer LED"
      Height          =   375
      Left            =   8280
      TabIndex        =   1
      Top             =   3720
      Width           =   1335
   End
   Begin VB.CommandButton mBtnStart 
      Caption         =   "Démarrer"
      Height          =   495
      Left            =   240
      TabIndex        =   0
      Top             =   3720
      Width           =   1455
   End
   Begin VB.Label Label21 
      Alignment       =   2  'Center
      Caption         =   "22"
      Height          =   255
      Left            =   8640
      TabIndex        =   37
      Top             =   1680
      Width           =   375
   End
   Begin VB.Label Label20 
      Alignment       =   2  'Center
      Caption         =   "20"
      Height          =   255
      Left            =   7920
      TabIndex        =   36
      Top             =   1680
      Width           =   255
   End
   Begin VB.Label Label19 
      Alignment       =   2  'Center
      Caption         =   "16"
      Height          =   255
      Left            =   6240
      TabIndex        =   35
      Top             =   1680
      Width           =   375
   End
   Begin VB.Label Label18 
      Alignment       =   2  'Center
      Caption         =   "14"
      Height          =   255
      Left            =   5520
      TabIndex        =   34
      Top             =   1680
      Width           =   255
   End
   Begin VB.Label Label17 
      Alignment       =   2  'Center
      Caption         =   "10"
      Height          =   255
      Left            =   3840
      TabIndex        =   33
      Top             =   1680
      Width           =   375
   End
   Begin VB.Label Label16 
      Alignment       =   2  'Center
      Caption         =   "8"
      Height          =   255
      Left            =   3120
      TabIndex        =   32
      Top             =   1680
      Width           =   375
   End
   Begin VB.Label Label15 
      Alignment       =   2  'Center
      Caption         =   "4"
      Height          =   255
      Left            =   1560
      TabIndex        =   31
      Top             =   1680
      Width           =   255
   End
   Begin VB.Label Label14 
      Alignment       =   2  'Center
      Caption         =   "2"
      Height          =   255
      Left            =   720
      TabIndex        =   30
      Top             =   1680
      Width           =   375
   End
   Begin VB.Label Label13 
      Alignment       =   2  'Center
      Caption         =   "18"
      Height          =   255
      Left            =   7080
      TabIndex        =   29
      Top             =   1680
      Width           =   375
   End
   Begin VB.Label Label8 
      Alignment       =   2  'Center
      Caption         =   "12"
      Height          =   255
      Left            =   4680
      TabIndex        =   28
      Top             =   1680
      Width           =   375
   End
   Begin VB.Label Label3 
      Alignment       =   2  'Center
      Caption         =   "6"
      Height          =   255
      Left            =   2400
      TabIndex        =   27
      Top             =   1680
      Width           =   255
   End
   Begin VB.Label Label2 
      Alignment       =   1  'Right Justify
      Caption         =   "24"
      Height          =   255
      Left            =   9360
      TabIndex        =   26
      Top             =   1680
      Width           =   375
   End
   Begin VB.Label Label1 
      Caption         =   "0"
      Height          =   255
      Left            =   120
      TabIndex        =   25
      Top             =   1680
      Width           =   135
   End
   Begin VB.Label Label12 
      Alignment       =   2  'Center
      Caption         =   "Hier"
      Height          =   255
      Left            =   360
      TabIndex        =   16
      Top             =   1920
      Width           =   495
   End
   Begin VB.Line Line1 
      X1              =   120
      X2              =   9600
      Y1              =   2040
      Y2              =   2040
   End
   Begin VB.Label Label11 
      Caption         =   "Aujourd'hui"
      Height          =   255
      Left            =   240
      TabIndex        =   15
      Top             =   120
      Width           =   1815
   End
   Begin VB.Label mLabelStatus 
      Caption         =   "(status)"
      Height          =   255
      Left            =   4080
      TabIndex        =   13
      Top             =   3840
      Width           =   3255
   End
   Begin VB.Label Label10 
      Caption         =   "Etat:"
      Height          =   255
      Left            =   3480
      TabIndex        =   12
      Top             =   3840
      Width           =   495
   End
End
Attribute VB_Name = "FormMain"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Option Base 0

'Declare use of the DLL
'K8047D.DLL interface

'GENERAL PROCEDURES
Private Declare Sub StartDevice Lib "k8047d.dll" ()
Private Declare Sub StopDevice Lib "k8047d.dll" ()

'INPUT PROCEDURE
Private Declare Sub ReadData Lib "k8047d.dll" (Array_Pointer As Long)

'OUTPUT PROCEDURE
Private Declare Sub SetGain Lib "k8047d.dll" (ByVal Channel_no As Long, ByVal Gain As Long)
Private Declare Sub LEDon Lib "k8047d.dll" ()
Private Declare Sub LEDoff Lib "k8047d.dll" ()

'Declare variables
Dim Simulation As Boolean
Dim DataBuffer(7) As Long

'1 Day = 60*24=1440 minutes
Const DataSize As Integer = 1440

Dim CurrentCanal As Integer
Dim CurrentGain As Integer
Dim CurrentVoltCoef As Double

Dim DataYesterday(DataSize) As Integer
Dim DataToday(DataSize) As Integer
Dim DayIndex As Integer
Dim StartTime As Variant

Private Sub Form_Load()

    ' Mettre a True pour debugger, false en mode normal
    Simulation = True
    
    ' Commence en mode arrete
    mBtnStop_Click
    
    If Not Simulation Then StartDevice
    
    ' Gain: 1=30V, 2=15V, 5=6V, 10=3V
    
    DayIndex = 0
    mComboCanal.ListIndex = 0
    mComboGain.ListIndex = 0
    
    mComboGain_Click
    mComboCanal_Click
    
    DrawPicture mPictureToday, DataToday
    DrawPicture mPictureYesterday, DataYesterday
    
    If Simulation Then
        mTimer1.Interval = 1000 ' 1 second
    Else
        mTimer1.Interval = 60000 ' 1 minute
    End If
    mTimer1.Enabled = False
    
    If Simulation Then mCheckSimulation.Value = 1
    
End Sub

Private Sub Form_Paint()
    DrawPicture mPictureToday, DataToday
    DrawPicture mPictureYesterday, DataYesterday
End Sub

Private Sub Form_Terminate()
    If Not Simulation Then StopDevice
End Sub

Private Sub mComboCanal_Click()
    CurrentCanal = Int(mComboCanal.ItemData(mComboCanal.ListIndex))
End Sub

Private Sub mComboGain_Click()
    CurrentGain = Int(mComboGain.ItemData(mComboGain.ListIndex))
    CurrentVoltCoef = 30 / CurrentGain / 255

    If Not Simulation Then
        SetGain 1, CurrentGain
        SetGain 2, CurrentGain
        SetGain 3, CurrentGain
        SetGain 4, CurrentGain
    End If
End Sub

Private Sub mCheckLED_Click()
    If mCheckLED.Value = 1 Then LEDon Else LEDoff
End Sub

Private Sub mCheckSimulation_Click()
    Simulation = (mCheckSimulation.Value = 1)
End Sub

Private Sub mBtnStart_Click()
    mTimer1.Enabled = True
    StartTime = Time
    If Simulation Then
        mLabelStatus.Caption = "Enregistrement (simulation)"
    Else
        mLabelStatus.Caption = "Enregistrement en cours"
    End If
End Sub

Private Sub mBtnStop_Click()
    mTimer1.Enabled = False
    mLabelStatus.Caption = "Arrêté"
End Sub

Private Sub mTimer1_Timer()
    ReadOne
    If DayIndex >= DataSize Then
        SwitchNextDay
    End If
End Sub

Private Sub mBtnUpdateNow_Click()
    mTimer1_Timer
End Sub

Private Sub ReadOne()
    Dim i As Integer
    Dim s As String
    Dim t, h, m As Variant
    
    t = Time
    h = Hour(t)
    m = Minute(t)
    DayIndex = h * 60 + m
    mLabelTime.Caption = Format(h, "00") + "h " + Format(m, "00")
    
    If Not Simulation Then
        ReadData DataBuffer(0)
    Else
        SimulateRead
    End If
    
    mTextLoggerIndex.Text = Format(DataBuffer(0)) + "," + Format(DataBuffer(1))
    For i = 0 To 3
        mTextVolt(i).Text = Format(CurrentVoltCoef * DataBuffer(2 + i), "0.0 V")
    Next

    If CurrentCanal >= 0 And CurrentCanal <= 3 Then
        ' canal 0..3 is data byte #2..6
        DataToday(DayIndex) = DataBuffer(CurrentCanal + 2)
        
        DrawPicture mPictureToday, DataToday
        DayIndex = DayIndex + 1
    End If
    
End Sub

Private Sub SwitchNextDay()
    Dim i As Integer
    
    ' Transfer today to yesterday
    For i = 0 To DataSize - 1
        DataYesterday(i) = DataToday(i)
        DataToday(i) = 0
    Next i
    DayIndex = 0
    DrawPicture mPictureYesterday, DataYesterday
End Sub

Private Sub SimulateRead()
    Dim b, i As Integer
    Dim t1, t2 As Long
    
    t1 = Hour(Time) * 3600 + Minute(Time) * 60 + Second(Time)
    t2 = Hour(StartTime) * 3600 + Minute(StartTime) * 60 + Second(StartTime)
    DayIndex = (t1 - t2) Mod DataSize
    t1 = DayIndex Mod 60
    t2 = Int(DayIndex / 60)
    mLabelTime.Caption = Format(t2, "00") + "h " + Format(t1, "00")
    
    b = 255 * ((Sin(DayIndex * 3.14159265385 * 6 / DataSize) + 1) / 2)
    For i = 0 To 5
        DataBuffer(i) = (256 + b - 40 + 20 * i) Mod 256
    Next
End Sub

Private Sub DrawPicture(ByRef picbox As PictureBox, ByRef data() As Integer)
    Dim w, h As Integer
    Dim i, x, y, y1, y2, x1, x2 As Integer
    Dim xcoef, ycoef, tcoef As Double
    
    picbox.Refresh
    
    w = picbox.ScaleWidth
    h = picbox.ScaleHeight
    
    y1 = 0
    y2 = h - 1
    ycoef = (y2 - y1) / 255
    
    x1 = 0
    x2 = w - 1
    xcoef = (x2 - x1) / DataSize
    
    ' Couleurs: http://msdn.microsoft.com/en-us/library/d2dz8078(VS.80).aspx
    picbox.ForeColor = QBColor(8) ' gris
    
    picbox.Line (0, y1)-(w, y1)
    picbox.Line (0, y2)-(w, y2)

    tcoef = (x2 - x1) / 24
    For i = 0 To 24
        x = x1 + i * tcoef
        If i Mod 6 = 0 Then
            y = 0
        ElseIf i Mod 2 = 0 Then
            y = (y2 - y1) / 2
        Else
            y = (y2 - y1) * 3 / 4
        End If
        picbox.Line (x, y)-(x, y2)
    Next

    picbox.ForeColor = QBColor(0) ' noir

    y = data(0) * ycoef
    picbox.CurrentX = 0
    picbox.CurrentY = y

    For i = 0 To DataSize - 1
        y = y2 - data(i) * ycoef
        x = x1 + i * xcoef
        picbox.Line -(x, y)
    Next i
End Sub
